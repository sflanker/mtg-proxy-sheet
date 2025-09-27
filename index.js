export class ProxyCardSheetGenerator {
  constructor(dckForm, proxySheetPages) {
    this.dckForm = dckForm
    this.proxySheetPages = proxySheetPages

    this.dckForm.addEventListener('submit', this.handleDckFormSubmit.bind(this))
  }

  handleDckFormSubmit(event) {
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

    // TODO: implementation
  }
}
