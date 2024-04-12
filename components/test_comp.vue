<template>
    <div class="lists-container">
      <div
        v-for="(list, listIndex) in cardLists"
        :key="`list-${listIndex}`"
        class="list"
        @drop="onDrop($event, listIndex)"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="list-header">List {{ listIndex + 1 }}</div>
        <div
          class="card-container"
        >
          <div
            v-for="(card, cardIndex) in list.cards"
            :key="card.id"
            class="card"
            draggable="true"
            @dragstart="onDragStart($event, card, listIndex, cardIndex)"
            @dragover.prevent
            @drop="onDrop($event, listIndex, cardIndex)"
          >
            {{ card.text }}
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        cardLists: [
          { cards: [{ id: 1, text: 'Card 1A' }, { id: 2, text: 'Card 1B' }] },
          { cards: [{ id: 3, text: 'Card 2A' }, { id: 4, text: 'Card 2B' }] },
          // Add more lists as needed
        ],
        draggedCard: null,
        sourceListIndex: null,
        sourceCardIndex: null,
      };
    },
    methods: {
      onDragStart(event, card, listIndex, cardIndex) {
        this.draggedCard = card;
        this.sourceListIndex = listIndex;
        this.sourceCardIndex = cardIndex;
        event.dataTransfer.effectAllowed = 'move';
      },
      onDrop(event, targetListIndex, targetCardIndex = null) {
        event.preventDefault();
  
        // Check if the card is moved within the same list and allow reordering
        if (this.sourceListIndex === targetListIndex && targetCardIndex !== null) {
          let list = this.cardLists[targetListIndex].cards;
          list.splice(this.sourceCardIndex, 1); // Remove card from its original position
          list.splice(targetCardIndex, 0, this.draggedCard); // Insert card at new position
        } else if (this.sourceListIndex !== targetListIndex) {
          // Move card to a different list
          this.cardLists[this.sourceListIndex].cards.splice(this.sourceCardIndex, 1); // Remove from old list
          this.cardLists[targetListIndex].cards.push(this.draggedCard); // Add to the new list
        }
  
        // Reset drag state
        this.draggedCard = null;
        this.sourceListIndex = null;
        this.sourceCardIndex = null;
      },
    },
  };
  </script>
  
  
  
  <style>
  .lists-container {
    display: flex;
    justify-content: space-around;
  }
  
  .list {
    border: 1px solid grey;
    margin: 10px;
    padding: 10px;
    width: 200px;
  }
  
  .list-header {
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .card-container {
    min-height: 100px;
  }
  
  .card {
    margin: 5px;
    padding: 10px;
    background-color: #f0f0f0;
    border: 1px solid black;
    cursor: grab;
  }
  </style>
  