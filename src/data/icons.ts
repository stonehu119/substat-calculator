import noneIconUrl from '../assets/none-icon.svg'

const charIconFiles = import.meta.glob<string>('../assets/icons/characters/*.webp', { eager: true, query: '?url', import: 'default' })
const lcIconFiles = import.meta.glob<string>('../assets/icons/light-cones/*.webp', { eager: true, query: '?url', import: 'default' })
const relicIconFiles = import.meta.glob<string>('../assets/icons/relic-sets/*.webp', { eager: true, query: '?url', import: 'default' })
const planarIconFiles = import.meta.glob<string>('../assets/icons/planar-sets/*.webp', { eager: true, query: '?url', import: 'default' })

function sanitize(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function charIcon(name: string): string { return charIconFiles[`../assets/icons/characters/${sanitize(name)}.webp`] }
export function lcIcon(name: string): string { return lcIconFiles[`../assets/icons/light-cones/${sanitize(name)}.webp`] }
export function relicIcon(name: string): string { return name === "(None)" ? noneIconUrl : relicIconFiles[`../assets/icons/relic-sets/${sanitize(name)}.webp`] }
export function planarIcon(name: string): string { return name === "(None)" ? noneIconUrl : planarIconFiles[`../assets/icons/planar-sets/${sanitize(name)}.webp`] }
