"use strict";
const nodemailer = require("nodemailer");
const { readFileSync } = require("fs");
const path = require("path");

function getTransport() {
  return nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.ZOHO_MAIL,
      pass: process.env.ZOHO_KEY, 
    },
  });
}

const mailNewUserMessage = async (recipient) => {
    const newUserView = readFileSync(path.resolve(__dirname, "../views", "mailer","newUserMessage.html"), "utf-8");
    const message = newUserView.replace("{recipient}", recipient.username).replace("{adminId}", process.env.ADMIN_ID);

    const transport = getTransport();
    const mailIns = await transport.sendMail({
        from:process.env.ZOHO_MAIL,
        to:recipient.email,
        subject:"Welcome to Chatlio",
        text:message.substring(message.indexOf("Hi!"), message.indexOf("</p>")),
        html:message
    })
    return mailIns.accepted;
}


const mailNewChatMessage = async (chatInitializingUser, userToBeEmailed) => {
    const newChatView = readFileSync(path.resolve(__dirname, "../views", "mailer","newChatMessage.html"), "utf-8");
    const message = newChatView.replace("{recipient}", userToBeEmailed.username).replace("{sender}", chatInitializingUser.username);


    const transport = getTransport();

    const mailIns = await transport.sendMail({
        from:process.env.ZOHO_MAIL,
        to:chatInitializingUser.email,
        subject:"New Chat Added",
        text:message.substring(message.indexOf("Hi!"), message.indexOf("</p>")),
        html:message
    })

    return mailIns.accepted;
}

module.exports = {mailNewChatMessage, mailNewUserMessage};

