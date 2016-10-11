const helpers = {
  min(time){
    return this.doubleZero(Math.floor((time/60)))
  },
  seg(time){
    return this.doubleZero(time%60)
  },
  doubleZero(time){
    if (time < 10){
      time = '0' + time
    }
    return time
  },
  formatTime(time){
    time = time
    time = time.toFixed(0)
    // return time
    return String(this.min(time))+':'+String(this.seg(time))
  }
}
export default helpers;
