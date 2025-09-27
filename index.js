export class ProxyCardSheetGenerator {
  constructor(dckForm, proxySheetPages) {
    this.dckForm = dckForm;
    this.proxySheetPages = proxySheetPages;

    this.dckForm.addEventListener('submit', this.handleDckFormSubmit.bind(this));
  }

  async handleDckFormSubmit(event) {
    event.preventDefault();

    /*
    .dck files are text files with lines having the following possible formats:

    Deck Name Declaration:
    NAME:<deck-name>

    Card Declaration:
    qty [setCode:cardId] cardName

    Sideboard Card Declaration:
    SB: qty [setCode:cardId] cardName

    Other line will start with letter characters followed by a colon and some additional data. These can be safely ignored.

    For example:

    NAME:ElfStorm
    1 [2X2:298] Aether Vial
    SB: 1 [CMM:320] Selvala, Heart of the Wilds
    LAYOUT SIDEBOARD:(1,1)(NONE,false,50)|([CMM:320])

    Would represent a deck called ElfStorm with 1 Aether Vial in the main deck and 1 Selvala, Heart of the Wilds in the sideboard.

    For each card, JSON format card metadata can be obtained by fetching the following URL format with the Accept: application/json header:
    https://api.scryfall.com/cards/{setCode}/{cardId}

    The JSON object that is returned will have a property called "image_uris" which will contain a number of URLs for different sizes and formats. Specifically we want to use the "large" size which is a jpeg.

    Once we have obtained the image URL for each card we can add an image to the proxy sheet pages, which will be contained by the proxySheetPages div element.
    Images should be grouped in page divs, with a maximum of 9 cards per page.

    Layout and sizing will be handled in CSS.
    */

    const fileInput = this.dckForm.querySelector('#dck-file');
    const file = fileInput.files[0];

    if (!file) {
      alert('Please select a .dck file');
      return;
    }

    try {
      // Clear existing proxy sheets
      this.proxySheetPages.innerHTML = '';

      // Read and parse the .dck file
      const fileContent = await this.readFile(file);
      const { mainDeckCards, sideboardCards } = this.parseDckFile(fileContent);

      // Combine main deck and sideboard cards
      const allCards = [...mainDeckCards, ...sideboardCards];

      if (allCards.length === 0) {
        alert('No valid cards found in the .dck file');
        return;
      }

      // Fetch card metadata and create proxy pages
      await this.createProxyPages(allCards);

    } catch (error) {
      console.error('Error processing .dck file:', error);
      alert('Error processing .dck file. Please check the console for details.');
    }
  }

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  parseDckFile(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    let deckName = 'Unknown Deck';
    const mainDeckCards = [];
    const sideboardCards = [];

    for (const line of lines) {
      // Deck name declaration
      if (line.startsWith('NAME:')) {
        deckName = line.substring(5).trim();
        continue;
      }

      // Sideboard card declaration
      if (line.startsWith('SB: ')) {
        const cardData = this.parseCardLine(line.substring(4));
        if (cardData) {
          sideboardCards.push(cardData);
        }
        continue;
      }

      // Regular card declaration (main deck)
      const cardData = this.parseCardLine(line);
      if (cardData) {
        mainDeckCards.push(cardData);
      }
    }

    return { deckName, mainDeckCards, sideboardCards };
  }

  parseCardLine(line) {
    // Match pattern: qty [setCode:cardId] cardName
    const match = line.match(/^(\d+)\s+\[([^:]+):([^\]]+)\]\s+(.+)$/);
    if (!match) return null;

    const [, qty, setCode, cardId, cardName] = match;
    return {
      quantity: parseInt(qty, 10),
      setCode,
      cardId,
      cardName: cardName.trim()
    };
  }

  async createProxyPages(cards) {
    const cardsPerPage = 9;
    const totalPages = Math.ceil(cards.length / cardsPerPage);

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'proxy-page';

      const startIndex = pageIndex * cardsPerPage;
      const endIndex = Math.min(startIndex + cardsPerPage, cards.length);
      const pageCards = cards.slice(startIndex, endIndex);

      // Fetch metadata for all cards on this page
      const cardPromises = pageCards.map(card => this.fetchCardMetadata(card));
      const cardMetadata = await Promise.all(cardPromises);

      // Create card elements for this page
      cardMetadata.forEach((metadata, index) => {
        if (metadata) {
          const cardElement = this.createCardElement(metadata, pageCards[index]);
          pageDiv.appendChild(cardElement);
        }
      });

      this.proxySheetPages.appendChild(pageDiv);
    }
  }

  async fetchCardMetadata(card) {
    try {
      const url = `https://api.scryfall.com/cards/${card.setCode}/${card.cardId}`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        ...card,
        imageUrl: data.image_uris?.large,
        cardData: data
      };
    } catch (error) {
      console.error(`Error fetching metadata for ${card.cardName}:`, error);
      return null;
    }
  }

  createCardElement(metadata, originalCard) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'proxy-card';

    if (metadata.imageUrl) {
      const img = document.createElement('img');
      img.src = metadata.imageUrl;
      img.alt = metadata.cardName;
      img.className = 'card-image';
      cardDiv.appendChild(img);
    } else {
      // Fallback if no image available
      const fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'card-fallback';
      fallbackDiv.textContent = `${originalCard.quantity}x ${originalCard.cardName}`;
      cardDiv.appendChild(fallbackDiv);
    }

    return cardDiv;
  }
}
