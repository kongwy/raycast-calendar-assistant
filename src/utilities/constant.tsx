import { getPreferenceValues } from "@raycast/api"

interface Preferences {
    key: string
    model: string
}
export const PREFERENCES = getPreferenceValues<Preferences>()

export type Model = { id: string, desc: string, max: number }
export const MODELS: Model[] = [
    {
        id: "gpt-4",
        desc: "More capable than any GPT-3.5 model, able to do more complex tasks, and optimized for chat. Will be updated with our latest model iteration.",
        max: 8192
    },
    {
        id: "gpt-4-32k",
        desc: "Same capabilities as the base gpt-4 mode but with 4x the context length. Will be updated with our latest model iteration.",
        max: 32768
    },
    {
        id: "gpt-3.5-turbo",
        desc: "Most capable GPT-3.5 model and optimized for chat at 1/10th the cost of text-davinci-003. Will be updated with our latest model iteration.",
        max: 4096
    }
]
export const DEFAULT_MODEL = MODELS.find((model) => model.id === PREFERENCES.model) || MODELS[0]

export const PROMPT = `You are given a text delimited by triple backticks. The text may:

- Be copied from a website, an email, a SMS, or any other source.
- Contain one or more events.

Your task is to extract any events from the text and return them with a valid ICS file.
Your response should not contain any other thing besides the ICS file.

If there's no event in the text, just return "null" only.
`
