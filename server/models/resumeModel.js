const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    jobTitle: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    description: String,
});

const educationSchema = new mongoose.Schema({
    degree: String,
    school: String,
    location: String,
    gradYear: String,
});

const resumeSchema = new mongoose.Schema({
    personalInfo: {
        fullName: String,
        email: String,
        phone: String,
        linkedin: String,
        website: String,
        address: String,
    },
    summary: String,
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [String],
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);