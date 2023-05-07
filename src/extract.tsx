import { Form, ActionPanel, Action, showToast, Detail, useNavigation, LocalStorage, Toast, environment, open } from "@raycast/api";
import { DEFAULT_MODEL, MODELS, Model } from "./utilities/constant";
import requestCalendarEvent from "./utilities/openai";
import { useEffect, useState } from "react";
import { useExec } from "@raycast/utils";
import * as fs from 'fs';

export default function Command() {
    const [model, setModel] = useState<Model>(DEFAULT_MODEL)
    const [source, setSource] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)
    const { push } = useNavigation()

    function onModelChange(newValue: string) {
        const newModel = MODELS.find((model) => model.id === newValue)
        newModel && setModel(newModel)
    }

    function onSubmit() {
        push(<Preview model={model} source={source} open={open} />)
    }

    return (
        <Form actions={
            <ActionPanel>
                <Action.SubmitForm onSubmit={onSubmit} />
            </ActionPanel>
        }>
            <Form.Dropdown
                id="model"
                title="Model"
                value={model.id}
                onChange={onModelChange}
                info={model.desc}
            >
                {MODELS.map((model) => (
                    <Form.Dropdown.Item title={model.id} value={model.id} key={model.id} />
                ))}
            </Form.Dropdown>
            <Form.TextArea
                id="source"
                title="Source"
                placeholder="Enter source text..."
                value={source}
                onChange={setSource}
                autoFocus
            />
            <Form.Checkbox
                id="open"
                label="Open calendar event file after generation completed"
                value={open}
                onChange={setOpen}
            />
        </Form>
    );
}

interface PreviewProps {
    model: Model
    source: string
    open: boolean
}

export function Preview(prop: PreviewProps) {
    const { model, source } = prop
    const { isLoading, data, mutate } = requestCalendarEvent(model.id, source, (error) => {
        showToast({ title: "Error", message: error.message, style: Toast.Style.Failure })
    })

    useEffect(() => {
        if (isLoading) {
            showToast({ title: "Processing", message: "Generating...", style: Toast.Style.Animated })
        } else {
            if (data === "null") {
                showToast({ title: "Error", message: "No events found.", style: Toast.Style.Failure })
            }
        }
    }, [isLoading, data])

    function format(data: string | undefined) {
        if (data == undefined) {
            return "Loading..."
        } else {
            return `
\`\`\`
${data}
\`\`\``
        }
    }

    function action(data: string | undefined) {
        if (data == undefined || data === "null") {
            return undefined
        } else {
            return <ActionPanel>
                <Action
                    title="Generate"
                    onAction={writeAndOpen}
                />
            </ActionPanel>
        }
    }

    function writeAndOpen() {
        const path = `${environment.supportPath}/temp.ics`
        fs.writeFile(path, data || "", (err) => {
            if (err) {
                showToast({ title: "Error", message: "Cannot generate file.", style: Toast.Style.Failure })
                return
            }
        })
        open(path)
    }

    return (<
        Detail
        markdown={format(data)}
        isLoading={isLoading}
        actions={action(data)}
    />)
}
