/** @deprecated Use generationLimits.js — kept for import compatibility */
import { getRoadmapQuota } from './generationLimits.js'

export {
    canGenerateRoadmap as canGenerate,
    incrementRoadmap as incrementGeneration,
    getRoadmapQuota,
    migrateLegacyLimits,
} from './generationLimits.js'

export async function generationsLeft(user) {
    const q = await getRoadmapQuota(user)
    return q.remaining
}

export function resetTime() {
    return ''
}
