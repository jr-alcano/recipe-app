const express = require('express');
const axios = require('axios');
require('dotenv').config();
const db = require('../db');
const { ensureLoggedIn } = require('../middleware/auth');

const router = express.Router();
const API_KEY = process.env.SPOONACULAR_API_KEY;

console.log("Starting to register recipe routes");

try {
  console.log("Registering GET /search");
  router.get('/search', async (req, res, next) => {
    try {
      const query = req.query.query;

      if (!query) {
        return res.status(400).json({ error: 'Missing query parameter' });
      }

      const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
        params: {
          apiKey: API_KEY,
          query: query,
          number: 5,
          addRecipeInformation: true
        },
      });

      const simplified = response.data.results.map(r => ({
        id: r.id,
        title: r.title,
        image: r.image,
        sourceUrl: r.sourceUrl
      }));

      return res.json(simplified);
    } catch (err) {
      return next(err);
    }
  });
} catch (err) {
  console.error("Failed to register GET /search:", err);
}

try {
  console.log("Registering POST /save");
  router.post('/save', ensureLoggedIn, async (req, res, next) => {
    try {
      const { recipe_id, title, image } = req.body;
      const user_id = res.locals.user.id;

      if (!recipe_id || !title) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await db.query(
        `INSERT INTO saved_recipes (user_id, recipe_id, title, image)
         VALUES ($1, $2, $3, $4)
         RETURNING id, user_id, recipe_id, title, image, saved_at`,
        [user_id, recipe_id, title, image]
      );

      return res.status(201).json(result.rows[0]);
    } catch (err) {
      return next(err);
    }
  });
} catch (err) {
  console.error("Failed to register POST /save:", err);
}

try {
  console.log("Registering GET /user/:id");
  router.get('/user/:id', ensureLoggedIn, async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;

      if (+id !== userId) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const result = await db.query(
        `SELECT id, recipe_id, title, image, saved_at
         FROM saved_recipes
         WHERE user_id = $1
         ORDER BY saved_at DESC`,
        [userId]
      );

      return res.json(result.rows);
    } catch (err) {
      return next(err);
    }
  });
} catch (err) {
  console.error("Failed to register GET /user/:id:", err);
}

try {
  console.log("Registering GET /:id/details");
  router.get('/:id/details', async (req, res, next) => {
    try {
      const { id } = req.params;

      const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
        params: {
          apiKey: API_KEY
        }
      });

      const r = response.data;

      const recipeDetails = {
        id: r.id,
        title: r.title,
        image: r.image,
        readyInMinutes: r.readyInMinutes,
        servings: r.servings,
        instructions: r.instructions,
        ingredients: r.extendedIngredients.map(i => ({
          name: i.name,
          amount: i.amount,
          unit: i.unit
        }))
      };

      return res.json(recipeDetails);
    } catch (err) {
      return next(err);
    }
  });
} catch (err) {
  console.error("Failed to register GET /:id/details:", err);
}

try {
  console.log("Registering GET /:id/notes");
  router.get('/:id/notes', ensureLoggedIn, async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;

      const recipeCheck = await db.query(
        `SELECT id FROM saved_recipes WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );

      if (recipeCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Unauthorized to view notes for this recipe' });
      }

      const result = await db.query(
        `SELECT id, content, created_at
         FROM notes
         WHERE saved_recipe_id = $1
         ORDER BY created_at DESC`,
        [id]
      );

      return res.json(result.rows);
    } catch (err) {
      return next(err);
    }
  });
} catch (err) {
  console.error("Failed to register GET /:id/notes:", err);
}

try {
  console.log("Registering POST /:id/note");
  router.post('/:id/note', ensureLoggedIn, async (req, res, next) => {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = res.locals.user.id;

      if (!content) {
        return res.status(400).json({ error: 'Missing note content' });
      }

      const recipeCheck = await db.query(
        `SELECT id FROM saved_recipes WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );

      if (recipeCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Unauthorized to add note to this recipe' });
      }

      const result = await db.query(
        `INSERT INTO notes (saved_recipe_id, content)
         VALUES ($1, $2)
         RETURNING id, saved_recipe_id, content, created_at`,
        [id, content]
      );

      return res.status(201).json(result.rows[0]);
    } catch (err) {
      return next(err);
    }
  });
} catch (err) {
  console.error("Failed to register POST /:id/note:", err);
}

try {
  console.log("Registering DELETE /:id");
  router.delete('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = res.locals.user.id;

      const recipeCheck = await db.query(
        `SELECT id FROM saved_recipes WHERE id = $1 AND user_id = $2`,
        [id, userId]
      );

      if (recipeCheck.rows.length === 0) {
        return res.status(403).json({ error: 'Unauthorized delete attempt or recipe not found' });
      }

      await db.query(`DELETE FROM saved_recipes WHERE id = $1`, [id]);

      return res.json({ message: 'Deleted successfully' });
    } catch (err) {
      return next(err);
    }
  });
} catch (err) {
  console.error("Failed to register DELETE /:id:", err);
}

console.log("Finished registering all recipe routes");

module.exports = router;
