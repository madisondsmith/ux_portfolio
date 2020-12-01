const portfolio = {
    header: {},
    ml: {},
    minecraft: {}
  };
  
  app.ready(e => {
    listen(window, "scroll", portfolio.handleScroll);
    portfolio.header.bg = select(".portfolio-header-bg");
    portfolio.header.outlines = selectAll(".tab, .tab-outline");
    portfolio.header.outlines.forEach(el => el.style.opacity = 0);
    select('.tab-container').style.opacity = 1;
  
    anime({
      targets: ".tab, .tab-outline",
      translateY: (el, i) => [-(i*5)+"px", 0],
      opacity: (el, i) => [0, 1-i*0.08],
      easing: "easeOutQuad",
      delay: (el, i) => 500 + 50*i,
      scaleY: [0.8, 1],
      duration: 1200
    });
  
    anime({
      targets: ".hero-name-inner",
      translateY: ["1.2em", 0],
      easing: "easeOutExpo",
      delay: (el, i) => 1200 + 130*i,
      duration: 1200
    });
  
    anime({
      targets: ".portfolio-intro-header",
      translateY: ["-12px", 0],
      easing: "easeOutSine",
      opacity: [0, 1],
      delay: 1500,
      complete: () => {
        // Init low prio
        portfolio.minecraft.init();
        portfolio.ml.init();
      }
    });
  });
  
  portfolio.handleScroll = e => {
    window.scrollY > window.innerHeight * 0.4 ? 
      portfolio.header.bg.classList.add("scrolled-down") : 
      portfolio.header.bg.classList.remove("scrolled-down");
  }
  
  portfolio.header.updateLogoParallax = function() {
    var maxScroll = 500;
    var scrollOffset = window.scrollY;
    var progress = Math.min(scrollOffset / maxScroll, 1);
    var maxMovement = 3;
  
    portfolio.header.outlines.forEach((el, i) => {
      var movement = progress*maxMovement*i;
      var scale = 1-progress*0.2;
      el.style.transform = "translateY(-"+movement+"px) scaleY("+scale+")";
      el.style.opacity = 1-i*0.08-progress*0.3;
    });
  }
  
  portfolio.ml.init = () => {
    // Wrap every letter in a span
    const header = select('.grid-item-ml-text-wrapper');
    header.innerHTML = header.textContent.replace(/\S/g, "<span class='grid-item-header-ml-letter'>$&</span>");
  
    const mlAnimation = anime.timeline({loop: true})
      .add({
        targets: '.grid-item-header-ml-letter',
        translateY: ["1.3em", 0],
        translateZ: 0,
        duration: 750,
        delay: (el, i) => 50 * i
      }).add({
        targets: '.grid-item-header-ml-letter',
        opacity: 0,
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 750,
        delay: (el, i) => 200 + 50 * i
      });
  
    app.animations.track(mlAnimation, header);
  }
  
  portfolio.minecraft.reverse = false;
  portfolio.minecraft.isInMotion = false;
  
  portfolio.minecraft.init = function() {
    listen(".grid-item-minecraft", "mouseenter", () => {
      if (portfolio.minecraft.isInMotion == true) return;
      portfolio.playMinecraftAnimationReverse(portfolio.minecraft.reverse);
    });
  
    listen(".grid-item-minecraft", "mouseleave", () => {
      if (portfolio.minecraft.isInMotion == true) return;
      portfolio.playMinecraftAnimationReverse(portfolio.minecraft.reverse);
    });
  
    portfolio.minecraft.block = select(".grid-item-minecraft-block");
    portfolio.minecraft.frames = portfolio.minecraft.block.dataset.frames;
    const blockRect = portfolio.minecraft.block.getBoundingClientRect();
    portfolio.minecraft.frameWidth = blockRect.width;
    portfolio.minecraft.frameHeight = blockRect.height;
    portfolio.minecraft.currentFrame = 20;
  }
  
  portfolio.playMinecraftAnimationReverse = function(reverse) {
    portfolio.minecraft.reverse = !portfolio.minecraft.reverse;
    portfolio.stopAnimation();
    // Flip direction
    portfolio.minecraft.currentFrame = portfolio.minecraft.frames - portfolio.minecraft.currentFrame;
  
    portfolio.minecraft.loop = setInterval(() => {
      if (portfolio.minecraft.currentFrame + 1 >= portfolio.minecraft.frames) {
        portfolio.stopAnimation();
        return;
      }
      // Stop animation from reversing if it's more than 2/5 through completion (then just complete it)
      if (portfolio.minecraft.currentFrame > portfolio.minecraft.frames/5*2) portfolio.minecraft.isInMotion = true;
  
      portfolio.minecraft.currentFrame++;
      portfolio.setMinecraftFrameToInt(portfolio.minecraft.currentFrame, reverse);
    }, 40);
  }
  
  portfolio.setMinecraftFrameToInt = function(frame, reverse) {
    portfolio.minecraft.block.style.backgroundPosition = -frame*portfolio.minecraft.frameWidth + "px " + reverse*portfolio.minecraft.frameHeight + "px";
  }
  
  portfolio.stopAnimation = function() {
    clearInterval(portfolio.minecraft.loop);
    portfolio.minecraft.isInMotion = false;
  }