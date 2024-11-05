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

    let captionButton = null
    let isBlocked = false
    let seconds = 0
    const getIsCaptionOn = () => captionButton ? captionButton.getAttribute('aria-pressed') : false

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

    if(!isBlocked){
        // i dont know the function to get if the page load, i know its out there, but for now this will do
        const checkForCaption = setInterval(() => {
            if(!captionButton){
                captionButton = document.querySelector('.ytp-subtitles-button')
                console.log('button found yippie')
                return
            }
            clearInterval(checkForCaption)
            // basically the page rendered
            doThisWhenPageRendered()
        }, 1000)

        const doThisWhenPageRendered = () => {
            const isStorageCaptionExist = localStorage.getItem('yt-is-caption-on')
            // youtube apparently did not save the caption value state, thats why when the webpage is refreshed the caption will always be false
            if(!isStorageCaptionExist){
                localStorage.setItem('yt-is-caption-on', getIsCaptionOn())
            }
            const isStorageCaptionOn = localStorage.getItem('yt-is-caption-on') === 'true'
            if(isStorageCaptionOn){
                captionButton.click()
            }
            // bruh this is bad
            setInterval(() => {
                // just do this if ad not showing
                if(!document.querySelector('.ad-showing')){
                    localStorage.setItem('yt-is-caption-on', getIsCaptionOn())
                }
            }, 2500)
        }
    }
})();
