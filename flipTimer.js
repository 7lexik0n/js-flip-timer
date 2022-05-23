class FlipTimer {
  constructor(el, options = {}) {
    this.el = el;
    this.date = this.getDate(options.date);
    this.geo = options.geo || {
      hours: "hours",
      minutes: "minutes",
      seconds: "seconds",
    };
    this.init();
  }

  getDate(date) {
    if (date) {
      return new Date(date);
    }

    const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
    return tomorrow;
  }

  init() {
    this.render();
    this.timeDiff = Math.ceil((this.date - new Date()) / 1000);
    this.startCount();
  }

  render() {
    this.el.classList.add("flipTimer");
    this.createFlipItem("hours");
    this.createFlipItem("minutes");
    this.createFlipItem("seconds");
    this.cards = [...this.el.querySelectorAll(".flip-card")];
  }

  createFlipItem(selector) {
    const flipItem = document.createElement("div");
    flipItem.className = `flip-item flip-${selector}`;
    this.el.insertAdjacentElement("beforeend", flipItem);
    const flipCards = document.createElement("div");
    flipCards.className = `flip-cards`;
    flipItem.insertAdjacentElement("beforeend", flipCards);
    this.createNumCard(flipCards, "tens");
    this.createNumCard(flipCards, "units");
    const flipTitle = document.createElement("span");
    flipTitle.classList = `flip-title`;
    flipItem.insertAdjacentElement("beforeend", flipTitle);
    flipTitle.innerText = this.geo[selector];
  }

  createNumCard(parent, selector) {
    const numCard = document.createElement("div");
    numCard.dataset.numberTop = "0";
    numCard.dataset.numberBottom = "0";
    // numCard.className = `flip-card flip-card-animating flip-${selector}`;
    numCard.className = `flip-card flip-${selector}`;
    parent.insertAdjacentElement("beforeend", numCard);
    const topHalf = document.createElement("div");
    const bottomHalf = document.createElement("div");
    topHalf.classList.add("flip-card-top");
    bottomHalf.classList.add("flip-card-bottom");
    numCard.insertAdjacentElement("beforeend", topHalf);
    numCard.insertAdjacentElement("beforeend", bottomHalf);
    topHalf.innerText = "0";
    bottomHalf.innerText = "0";
  }

  startCount() {
    this.timerID = setInterval(() => this.count(), 250);
  }

  count = () => {
    const timeDiff = Math.ceil((this.date - new Date()) / 1000);
    if (timeDiff < 0) {
      clearInterval(this.timerID);
      return;
    }
    if (timeDiff !== this.timeDiff) {
      this.timeDiff = timeDiff;
      this.animateTimer(this.timeDiff);
    }
  };

  animateTimer(time) {
    const seconds = time % 60;
    const minutes = Math.floor((time / 60) % 60);
    const hours = Math.floor(time / 3600);

    const secondsUnits = seconds % 10;
    const secondsTens = Math.floor(seconds / 10);
    const minutesUnits = minutes % 10;
    const minutesTens = Math.floor(minutes / 10);
    const hoursUnits = hours % 10;
    const hoursTens = Math.floor(hours / 10);

    const timeArr = [
      hoursTens,
      hoursUnits,
      minutesTens,
      minutesUnits,
      secondsTens,
      secondsUnits,
    ];

    this.cards.forEach((card, index) => {
      this.animateCard(card, timeArr[index]);
    });
  }

  animateCard = (card, num) => {
    const current = +card.dataset.numberTop;
    if (current === num) return;

    card.dataset.numberTop = num;
    card.querySelector(".flip-card-bottom").innerText = num;

    card.classList.add("flip-card-animating");

    const onAnimationEnds = () => {
      card.querySelector(".flip-card-top").innerText = num;
      card.dataset.numberBottom = num;
      card.classList.remove("flip-card-animating");
      card
        .querySelector(".flip-card-bottom")
        .removeEventListener("animationend", onAnimationEnds);
    };

    card
      .querySelector(".flip-card-bottom")
      .addEventListener("animationend", onAnimationEnds);
  };
}

window.createFlipTimer = (selector, geo = {}) => {
  document.addEventListener("DOMContentLoaded", () => {
    const timer = document.querySelector(selector);
    new FlipTimer(timer, geo);
  });
};

createFlipTimer(".flipTimer", {
  geo: {
    hours: "часы",
    minutes: "минуты",
    seconds: "секунды",
  },
});
