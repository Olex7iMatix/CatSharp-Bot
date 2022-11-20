const { Schema, model } = require("mongoose");

const schema = Schema({
    ticketOwnerId: { type: String, unique: true },
    ticketType: { type: String, default: "Bug Report" },
    deleted: { type: Boolean, default: false },
    messages: { type: [Object], default: [] }
})

module.exports = model("tickets", schema)