// ==UserScript==
// @name         YT Unblock Blocker
// @namespace    http://tampermonkey.net/
// @version      2024-09-27
// @description  Heheheha!!
// @author       You
// @match        https://www.youtube.com/*
// @exclude      https://www.youtube.com/shorts*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // let retryCount = 0
    // let isBlocked = false
    // const checkForBlocked = () => {
    //     const checkInterval = setInterval(() => {
    //         retryCount += 1
    //         console.log(`checking for the ${retryCount} time`)
    //         if(retryCount >= 20 || isBlocked){
    //             clearInterval(checkInterval)
    //             console.log('not blocked congrats')
    //         }
    //         if(document.querySelector('.ytd-enforcement-message-view-model')){
    //             console.log('blocked lol')
    //             isBlocked = true
    //             location.reload()
    //             return
    //         }
    //     }, 2500)
    // }
    // window.addEventListener("yt-navigate-start", e => { retryCount = 0; isBlocked = false });
    // window.addEventListener("yt-navigate-finish", e => { !isBlocked && checkForBlocked() });
    const timeToSeconds = (time) => {
        if(!time) return 0
        let convertedSeconds = 0
        const splittedTime = time.split(':')
        const lastSeconds = Number(splittedTime.pop())
        splittedTime.forEach((timeString, index) => {
            const timeNumber = Number(timeString)
            convertedSeconds += timeNumber * 60 ** (splittedTime.length - index)
        })
        return convertedSeconds + lastSeconds
    }

    let isBlocked = false
    let seconds = 0
    setInterval(() => {
        const currentTime = document.querySelector('.ytp-time-current').textContent
        seconds = timeToSeconds(currentTime)
        if(document.querySelector('.ytd-enforcement-message-view-model') && !isBlocked){
            isBlocked = true
            console.log('blocked lol')
            const searchParams = new URLSearchParams(location.search)
            // t for time
            // need s for time in seconds
            // ex: &t=420s
            searchParams.set('t', `${seconds}s`)
            window.location.href = `${location.pathname}?${searchParams}`
            return
        }
    }, 2500)
})();
