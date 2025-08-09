import {create} from 'zustand'

export const useThemeStore = create((set)=>({
    theme:localStorage.getItem("ChatWave-theme") || "primary",
    setTheme:(theme)=>{
        localStorage.setItem("ChatWave-theme",theme)
        set({theme})
    },
}))