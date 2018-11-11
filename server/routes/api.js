const express = require('express');
const { ObjectId } = require('mongodb');

const validUniforms = ['triangleScale', 'animate'];
const filterUniforms = (uniforms) => Object.keys(uniforms).reduce(
    (acc, name) => validUniforms.includes(name) ? {[name]: uniforms[name], ...acc} : acc,
    {},
);

const apiRouter = (animCollection) => {
    const router = express.Router();
    router.get('/health', (_, res) => {
        res.status(200).send('Hi!');
    });

    router.get('/animations', async (req, res) => {
        try {
            const { uid } = req.user;
            const animations = await animCollection.find({ uid }).toArray();
            res.send(animations || []);
        } catch (error) {
            console.error(error.message);
            req.send(500);
        }
    });

    router.post('/animations', async (req, res) => {
        const { uid } = req.user;
        try {
            const {
                initialAnimationState: { color, translation, scale, rotation, uniforms },
                animations, shaderAnimations, shaderName, name,
            } = req.body;
            const result = await animCollection.insertOne({
                initialAnimationState: { color, translation, scale, rotation, uniforms },
                shaderAnimations,
                animations,
                shaderName,
                uid,
                name,
            });
            res.status(201).send({ id: result.insertedId.str });
        } catch (error) {
            console.error(error.message);
            res.sendStatus(500);
        }
    });

    router.get('/animations/:id', async (req, res) => {
        try {
            const oid = ObjectId(req.params.id);
            const animation = await animCollection.findOne(oid);
            if (!animation || animation.uid !== req.user.uid) {
                return res.sendStatus(404);
            }
            res.send(animation);
        } catch (error) {
            console.error(error.message);
            res.sendStatus(500);
        }
    });

    router.put('animations/:id', async (req, res) => {
        try {
            const oid = ObjectId(req.params.id);
            const animation = await animCollection.findOne(oid);
            if (!animation || animation.uid !== req.user.uid) {
                return res.sendStatus(404);
            }
        } catch (error) {
            console.error(error.message);
            res.send(500);
        }
    });

    router.delete('animations/:id', async (req, res) => {
        try {
            const oid = ObjectId(req.params.id);
            const animation = await animCollection.findOne(oid);
            if (!animation || animation.uid !== req.user.uid) {
                return res.sendStatus(404);
            }
            await animCollection.deleteOne(oid);
            res.sendStatus(204);
        } catch (error) {
            console.error(error.message);
            res.sendStatus(500);
        }
    });

    router.get('/user', (req, res) => {
        res.send(req.user);
    });
    return router;
}

module.exports = apiRouter;