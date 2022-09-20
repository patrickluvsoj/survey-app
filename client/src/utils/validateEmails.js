import { regex } from "./regex"

export const validateEmails = (emails) => {
    const invalidEmails = emails.split(",").map(email => email.trim()).filter(email => !regex.test(email));

    console.log(invalidEmails);

    if (invalidEmails.length === 0) {
        return true
    } else {
        return `These emails are invalid: ${JSON.stringify(invalidEmails)}`
    }
}