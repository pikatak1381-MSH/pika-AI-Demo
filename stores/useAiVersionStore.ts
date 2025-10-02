import { create } from "zustand"

export const pikaAiVersions = ["Pika 02", "Pika 03", "Pika 04", "Pika 05"] as const

type Version = (typeof pikaAiVersions)[number]

interface VersionState {
    selectedVersion: Version
    setVersion: (version: Version) => void
    endpoint: string
}

const MAIN_ENDPOINT = "/api/chat/messages"
const TEST_ENDPOINT = "/api/chat/messages-test"

export const useAiVersionStore = create<VersionState>((set) => ({
    selectedVersion: "Pika 02",
    setVersion: (version) => set({
        selectedVersion: version,
        endpoint: version === "Pika 02" ? MAIN_ENDPOINT : TEST_ENDPOINT,
    }),
    endpoint: MAIN_ENDPOINT,
}))