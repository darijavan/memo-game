(function () {
  let gameScene = document.querySelector("#game-scene");

  let cardList = [{
      src: "img/card1.png",
    },
    {
      src: "img/card2.jpg",
    },
  ];

  let patternList = [{
      label: "2/3",
      row: 2,
      column: 3,
    },
    {
      label: "3/4",
      row: 3,
      column: 4
    }
  ];

  let imgList = [{
      src: "img/img1.png"
    },
    {
      src: "img/img2.png"
    },
    {
      src: "img/img3.png"
    },
    {
      src: "img/img4.png"
    },
    {
      src: "img/img5.png"
    },
    {
      src: "img/img6.png"
    },
  ];

  let config = {
    cardChoiceIndex: 0,
    patternChoiceIndex: 0
  };

  let attempts = 0,
    step = 0;

  initMenu(cardList, patternList);

  /**
   * Initialize menu
   * @param {Array<{ src: string }>} cardList The list of card back 
   * @param {Array<{ label: string, row: number, column: number }>} patternList The list of possible patterns
   */
  function initMenu(cardList, patternList) {
    let cardChoiceContainer = document.querySelector("#card-choice");

    let choices = new Array(cardList.length);

    cardList.forEach(function (value, index) {
      let choice = document.createElement("img");
      choice.classList.add("card");
      if (index == config.cardChoiceIndex)
        choice.classList.add("active");
      choice.src = value.src;

      choice.addEventListener("click", function (_) {
        if (index != config.cardChoiceIndex) {
          choices[config.cardChoiceIndex].classList.remove("active");
          choices[index].classList.add("active");

          config.cardChoiceIndex = index;
        }
      });

      choices[index] = choice;
      cardChoiceContainer.appendChild(choice);
    });

    let patternChoiceContainer = document.querySelector("#pattern-choice");

    let patterns = new Array(patternList.length);

    patternList.forEach(function (pattern, index) {
      let patternElement = document.createElement("div");
      patternElement.classList.add("pattern");
      if (index == config.patternChoiceIndex)
        patternElement.classList.add("active");
      patternElement.innerHTML = pattern.label;

      patternElement.addEventListener("click", function (_) {
        if (index != config.patternChoiceIndex) {
          patterns[config.patternChoiceIndex].classList.remove("active");
          patterns[index].classList.add("active");

          config.patternChoiceIndex = index;
        }
      });

      patterns[index] = patternElement;
      patternChoiceContainer.appendChild(patternElement);
    });

    document.querySelector("#play").addEventListener("click", function (_) {
      document.querySelector("#menu").classList.add("hidden");

      let card = cardList[config.cardChoiceIndex].src,
        pattern = patternList[config.patternChoiceIndex];

      initGameBoard(gameScene, imgList, {
        card,
        row: pattern.row,
        column: pattern.column
      });
    });
  }

  /**
   * Initialize game board container. Populate the container with interrogation mark image placeholder
   * @param {HTMLDivElement} gameScene The game scene div container
   * @param {Array<{ src: string }>} imgList List of images
   * @param {{ card: string, row: number, column: number }} config Configuration
   */
  function initGameBoard(gameScene, imgList, config) {
    gameScene.classList.remove("hidden");

    let gameBoard = gameScene.querySelector("#game-board");

    let state = new Array(config.row * config.column),
      list = imgList.slice(),
      blocks = new Array(config.row * config.column);

    for (let i = 0; i < config.row; i++) {
      let rowElement = document.createElement("div");
      rowElement.classList.add("row");

      for (let j = 0; j < config.column; j++) {
        let block = document.createElement("div");
        block.classList.add("block");

        let cardBack = document.createElement("img");
        cardBack.classList.add("back");
        cardBack.src = config.card;

        blocks[i * config.column + j] = block;

        block.appendChild(cardBack);

        rowElement.appendChild(block);
      }

      gameBoard.appendChild(rowElement);
    }

    let imageIndex = Math.floor(Math.random() * list.length);

    let indexes = new Array(config.row * config.column);
    for (let i = 0; i < indexes.length; i++) indexes[i] = i;

    while (indexes.length) {
      let i = Math.floor(Math.random() * indexes.length),
        index = indexes[i];
      indexes.splice(i, 1);

      let b = blocks[index];

      let img = b.querySelector(".image");

      if (!img) {
        img = document.createElement("img");
        img.classList.add("image");
      }

      img.src = list[imageIndex].src;
      state[index] = list[imageIndex].src;

      if (list[imageIndex].usedOnce) {
        list.splice(imageIndex, 1);
        imageIndex = Math.floor(Math.random() * list.length);
      } else
        list[imageIndex].usedOnce = true;

      b.appendChild(img);
    }

    // Event handler for each card block
    blocks.forEach((block, index) => {
      block.addEventListener("click", () => {
        let row = Math.floor(index / config.column),
          column = Math.floor(index % config.column);

        if (block.classList.contains("active")) {
          step--;
        } else {
          attempts++;
          step++;
          document.querySelector("#attempts").innerHTML = `${attempts}`;

          block.classList.add("active");

          setTimeout(() => {
            block.querySelector(".image").classList.add("active");
            if (step == 2) {
              let arr = blocks.filter(b => b.classList.contains("active"));

              setTimeout(() => {
                if (arr[0].querySelector(".image").src == arr[1].querySelector(".image").src) {

                } else {
                  arr.forEach(el => {
                    el.querySelector(".image").classList.remove("active");
                    setTimeout(() => el.classList.remove("active"), 200);
                  });
                }
                step = 0;
              }, 600);
            }
          }, 200);
        }
      });
    });
  }
})();