const express = require('express');
const { ObjectId } = require('mongodb');

const validUniforms = ['triangleScale', 'animate'];
const filterUniforms = (uniforms) => Object.keys(uniforms).reduce(
    (acc, name) => validUniforms.includes(name) ?
        {[name]: uniforms[name], ...acc} :
        acc,
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
            const animations = await animCollection.find({ uid })
                .project({ _id: true, name: true }).toArray();
            res.send(animations || []);
        } catch (error) {
            console.error(error.message);
            req.send(500);
        }
    });

    router.get('/animations/:id', async (req, res) => {
        try {
            const oid = ObjectId(req.params.id);
            const animation = await animCollection.findOne({ _id: oid });
            if (!animation || animation.uid !== req.user.uid) {
                return res.sendStatus(404);
            }
            res.send(animation);
        } catch (error) {
            console.error(error.message);
            res.sendStatus(500);
        }
    });

    const getAnimation = (body) => {
        const {
            initialAnimationState: { color, translation, scale, rotation, uniforms },
            animations, shaderAnimations,
            shaderName, animationName,
        } = body;
        return {
            initialAnimationState: { color, translation, scale, rotation, uniforms },
            name: animationName,
            shaderAnimations,
            animations,
            shaderName,
        };
    }

    router.post('/animations', async (req, res) => {
        const { uid } = req.user;
        try {
            const result = await animCollection.insertOne({ uid, ...getAnimation(req.body) });
            res.status(201).send({ _id: result.insertedId });
        } catch (error) {
            console.error(error.message);
            res.sendStatus(500);
        }
    });

    router.put('/animations/:id', async (req, res) => {
        try {
            const oid = ObjectId(req.params.id);
            const animation = await animCollection.findOne({ _id: oid });
            if (!animation || animation.uid !== req.user.uid) {
                return res.sendStatus(404);
            }
            await animCollection.updateOne({ _id: oid }, { $set: getAnimation(req.body) })
            res.sendStatus(204);
        } catch (error) {
            console.error(error.message);
            res.sendStatus(500);
        }
    });

    router.delete('/animations/:id', async (req, res) => {
        try {
            const oid = ObjectId(req.params.id);
            const animation = await animCollection.findOne({ _id: oid });
            if (!animation || animation.uid !== req.user.uid) {
                return res.sendStatus(404);
            }
            await animCollection.deleteOne({ _id: oid });
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