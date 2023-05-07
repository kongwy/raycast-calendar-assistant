import { Configuration, CreateChatCompletionRequest, OpenAIApi } from "openai";
import { useAsync, useAsyncAbortable } from "@react-hookz/web";
import { PREFERENCES, PROMPT } from "./constant";
import { usePromise } from "@raycast/utils"

export default function requestCalendarEvent(model: string, source: string, onError?: (error: Error) => void) {
    const openai = new OpenAIApi(new Configuration({
        apiKey: PREFERENCES.key
    }))
    const request: CreateChatCompletionRequest = {
        model: model,
        messages: [
            {
                role: "user",
                content: composePrompt(source)
            }
        ]
    }
    return usePromise(
        async () => {
            const response = await openai.createChatCompletion(request)
            return response.data.choices[0].message?.content
        },
        [],
        {
            onError: onError
        }
    )
}

function composePrompt(source: string) {
    return `${PROMPT}\n\`\`\`\n${source}\n\`\`\`\n`
}
