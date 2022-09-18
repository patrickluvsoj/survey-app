import { regex } from "./regex"

export const validateEmails = (emails) => {
    const invalidEmails = emails.split(",").map(email => email.trim()).filter(email => !regex.test(email));

    if (invalidEmails) {
        return `These emails are invalid: ${JSON.stringify(invalidEmails)}`
    } else {
        return false
    }
}