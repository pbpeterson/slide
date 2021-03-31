export default class Slide {
  constructor(slide, wrapper){
    this.slide = document.querySelector(slide)
    this.wrapper = document.querySelector(wrapper)
    this.dist = { finalPosition: 0, startX: 0, movement: 0 }
}

  updatePosition(clientX){
    this.dist.movement = (this.dist.startX - clientX)*1.6;
    return (this.dist.finalPosition - this.dist.movement)
  }

  moveSlide(distX){
    this.dist.movePosition = distX
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
  }

  onStart(event){
    event.preventDefault();
    if(event.type === 'mousedown'){
      this.dist.startX = event.clientX
      this.wrapper.addEventListener('mousemove', this.onMove)
    }else if (event.type ==='touchstart'){
      this.dist.startX = event.changedTouches[0].clientX
      this.wrapper.addEventListener('touchmove', this.onMove)
    }

  }

  onMove(){
    const pointer = (event.type ==='mousemove') ? event.clientX : event.changedTouches[0].clientX
    const finalPosition = this.updatePosition(pointer)
    this.moveSlide(finalPosition)
  }

  onEnd(event){
    const moveType =(event.type === 'mouseup') ? 'mousemove' : 'touchmove'
    this.wrapper.removeEventListener(moveType, this.onMove)
    this.dist.finalPosition = this.dist.movePosition

  }

  addSlideEvents(){
    this.wrapper.addEventListener('mousedown', this.onStart);
    this.wrapper.addEventListener('touchstart', this.onStart);
    this.wrapper.addEventListener('mouseup', this.onEnd);
    this.wrapper.addEventListener('touchend', this.onEnd);
  }

  bindEvent(){
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
  }

  // Slides config

  slidePosition(slide){
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2
    return -(slide.offsetLeft - margin)
  }

  slidesConfig(){
    this.slidesArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return{
        position,
        element
      }
    })
    console.log(this.slidesArray)
  }

  slidesIndexNav(index){
    const last = this.slidesArray.length - 1;
    console.log(last)
    this.index = {
      prev: index ? index - 1: undefined,
      active: index,
      next: index === last ? undefined : index + 1
    }
  }

  changeSlide(index){
    const activeSlide = this.slidesArray[index]
    this.moveSlide(activeSlide.position)
    this.slidesIndexNav(index)
    this.dist.finalPosition = activeSlide.position
  }

  init(){
    this.slidesConfig()
    this.bindEvent()
    this.addSlideEvents()
    return this
}
}