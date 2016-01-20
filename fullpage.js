"use strict";

import $ from 'jquery';
 
/*
Sample CSS Setup

Basics: Position slides absolute within container and stack them by z-index

.contanier{
    height: 100vw;
    width: 100vh;

    & > .slide{
        height: 0;
        
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        width: 100%;
        overflow: hidden;
        margin: 0; padding: 0; // avoid margin/paddings on slides
        
        transition: height 0.9s ease-in-out;

        &.active{ 
            height: 100%;
        }

        // adjust as needed
        @for $i from 1 through 9{
            &:nth-child(#{$i}){
                z-index: 10 - $i;
            }
        }
    }


}

*/

var delta,
    currentSlideIndex = 0,
    scrollThreshold = 3,
    dragThreshold = 0.15,
    dragStart = null,
    percentage = 0,
    target,
    previousTarget,
    activeClass = 'active',
    noAnimationClass = 'no-animation';

var slides;
var slideCount = 0;
var slideClass = '.fullp'; 

function setupGlobals(){
    slides = $(slideClass);
    slideCount = slides.length-1;
}

function touchStart(e){
    if( dragStart !== null ){ 
        return;
    }

    if( e.originalEvent.touches ){
        e = e.originalEvent.touches[0];
    }

    dragStart = e.clientY;

    target = slides.eq(currentSlideIndex)[0];

    target.classList.add(noAnimationClass);

    previousTarget = slides.eq(currentSlideIndex-1)[0];
    previousTarget.classList.add(noAnimationClass);
}

function touchMove(e){
    if( dragStart !== null ){ 
        return;
    }

    if( e.originalEvent.touches ){
        e = e.originalEvent.touches[0];
    }

    delta = dragStart - e.clientY;

    percentage = delta / $(window).height();

    if( percentage > 0 ){
        target.style.height = (100-(percentage*100))+'%';
        if( previousTarget ){
            previousTarget.style.height = '';
        }
    }else if( previousTarget ){
        previousTarget.style.height = (-percentage*100)+'%';
        target.style.height = '';
    }

    return false;
}

function touchEnd(){
    dragStart = null;

    target.classList.remove(noAnimationClass);
    if( previousTarget ){
        previousTarget.classList.remove(noAnimationClass);
    }

    if( percentage >= dragThreshold ){
        nextSlide();
    }else if( Math.abs(percentage) >= dragThreshold ){
        prevSlide();
    }else{
        showSlide();
    }

    percentage = 0;
}

function elementScroll(e){
    if( e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0 ){

        delta--;

        if( Math.abs(delta) >= scrollThreshold ){
            prevSlide();
        }

    }else{

        delta++;

        if( delta >= scrollThreshold ){
            nextSlide();
        }

    }

    return false;
}

function showSlide(){
    if( ! slides ){
        setupGlobals();  
    } 

    delta = 0;

    slides.each(function(i, slide){
        $(slide).toggleClass(activeClass, ( i >= currentSlideIndex ));
    });
}

function prevSlide(){
    currentSlideIndex--;

    if( currentSlideIndex < 0 ){
        currentSlideIndex = 0;
    }

    showSlide();
}

function nextSlide(){
    currentSlideIndex++;

    if( currentSlideIndex > slideCount ){
        currentSlideIndex = slideCount;
    }

    showSlide();
}

export { elementScroll, showSlide, touchStart, touchEnd, touchMove };
