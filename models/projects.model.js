const { Schema } = require("mongoose");

module.exports = mongoose => {
    const Project = mongoose.model(
        'project',
        mongoose.Schema(
            {
                name: String,
                contracts: [
                    {
                        contractID: String
                    }
                ],
                prioritySubmittals: [
                    {
                        submittal: { type: Schema.Types.ObjectId, ref: 'submittal' },
                        driver: String                        
                    }
                ],
                unrankedSubmittals: [
                    {
                        submittal: { type: Schema.Types.ObjectId, ref: 'submittal' },
                        driver: String                        
                    }
                ]
            },
            { timestamps: true }
        )
    );

    return Project;
}