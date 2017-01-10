document.registerElement('felds-scrollsnapper', class extends HTMLElement {
  createdCallback() {
    // config
    this.timeout = null

    this._onScroll = this._onScroll.bind(this)
    this._run = this._run.bind(this)
    this._animate = this._animate.bind(this)
  }


  attachedCallback() {
    this.addEventListener('scroll', this._onScroll, {passive: true})
  }


  _onScroll(e) {
    this.lastScrollEvent = e

    clearTimeout(this.timeout)
    this.timeout = setTimeout(this._run, this.delay)
  }


  _run() {
    const height = this.offsetHeight
    const scrollTop = this.scrollTop
    const treshold = Math.floor(height * this.treshold)
    const children = this.children

    for (let i = 0; i < children.length; i++) {
      const el = children.item(i)
      const top = el.offsetTop - scrollTop

      if (top > 0 && top <= treshold) {
        this._animate(this.scrollTop, el.offsetTop)
        break
      }
    }
  }

  _animate(fromPos, toPos) {
    const startTime = Date.now()
    const endTime = startTime + this.animationTime

    const totalDistance = toPos - fromPos
    const totalTime = endTime - startTime

    const animation = () => {
      const deltaTime = Math.max(0, Math.min(1, 1 - (endTime - Date.now()) / totalTime))
      const t = this._easing(deltaTime)

      this.scrollTop = fromPos + totalDistance * t

      if (Date.now() <= endTime) requestAnimationFrame(animation)
      else this.scrollTop = toPos
    }
    animation()

  }

  _easing(t) {
    // return t // linear
    // return t * (2  - t) // easeOutQuad
    return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 // easeInOutCubic
  }

  /*
   * Getters and setters
   */

  get treshold() {
    return Math.max(0, Math.min(1, parseFloat(this.getAttribute('treshold')))) || .5
  }
  set treshold(val) {
    this.setAttribute('treshold', Math.max(0, Math.min(1, parseFloat())))
  }
  get delay() {
    return parseInt(this.getAttribute('delay')) || 500
  }
  set delay(val) {
    this.setAttribute('delay', parseInt(val))
  }
  get animationTime() {
    return parseInt(this.getAttribute('animation-time')) || 500
  }
  set animationTime(val) {
    this.setAttribute('animation-time', parseInt(val))
  }
})
