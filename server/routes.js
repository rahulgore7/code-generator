const express = require('express');
const Code = require('./model');
const cron = require('node-cron');
const router = express.Router();

cron.schedule('*/60 * * * * *', async () => {
    try {
        // Generate a new code
        const newCode = new Code({
            value: generateCode(),
            used: false,
        });

        // Save the new code to the database
        await newCode.save();

        // Find and delete the old code (if any)
        const codeCount = await Code.countDocuments();
        console.log(codeCount);
        if (codeCount > 10) {
            const oldestCode = await Code.findOne().sort({ createdAt: 1 });
            console.log(` oldest code = ${oldestCode}`);
            if (oldestCode) {
                await Code.deleteOne({ _id: oldestCode._id });
                console.log('Oldest code deleted.');
            }
        }

        console.log('New code generated and old code deleted.');
    } catch (error) {
        console.error('Error in code generation and deletion task:', error);
    }
});


router.get('/api/codes', async (req, res) => {
    try {
        // Find the latest code
        const newCode = new Code({
            value: generateCode(),
            used: false,
        });

        // Save the new code to the database
        await newCode.save();

        res.json({ code: newCode.value });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/api/codes/use', async (req, res) => {
    try {
        const { code: userCode } = req.body;

        const existingCode = await Code.findOne({ value: userCode });

        if (!existingCode) {
            // Generate a new code if the user enters an invalid code
            const newCode = new Code({
                value: generateCode(),
                used: false,
            });
            await newCode.save();

            return res.status(400).json({
                error: 'Enter a valid code',
                newCode: newCode.value,
            });
        }

        if (existingCode.used) {
            // Generate a new code if the user enters an already used code
            const newCode = new Code({
                value: generateCode(),
                used: false,
            });
            await newCode.save();

            return res.status(400).json({
                error: 'This code has already been used',
                newCode: newCode.value,
            });
        }


        const currentTime = new Date();
        const codeCreationTime = existingCode.createdAt;
        const timeDifference = (currentTime - codeCreationTime) / 1000;

        if (timeDifference > 60) {
            // Generate a new code if the user enters an expired code
            const newCode = new Code({
                value: generateCode(),
                used: false,
            });
            await newCode.save();

            return res.status(400).json({
                error: 'The code has expired',
                newCode: newCode.value,
            });
        }

        existingCode.used = true;
        await existingCode.save();

        res.json({ message: 'Code is correct' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function generateCode() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

module.exports = router;
