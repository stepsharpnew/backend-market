<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      md="4"
      lg="3"
      v-for="(product, index) in products"
      :key="index"
    >
      <v-hover v-slot="{ isHovering, props }">
        <v-card
          class="mx-auto"
          max-width="320"
          v-bind="props"
        >
          <v-img
            height="200px"
            :src="product.category.image_url"
            cover
            class="align-end"
          >
            <v-expand-transition>
              <div
                v-if="isHovering"
                class="d-flex transition-fast-in-fast-out bg-orange-darken-2 v-card--reveal text-h4 "
                style="height: 40%;"
              >
                {{ product.price }} ₽
              </div>
            </v-expand-transition>
          </v-img>
          <v-card-title class="text-subtitle-2 text-start">{{ product.name }}</v-card-title>
          <v-card-actions>
            <v-btn color="orange-lighten-2">
              Подробнее
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :icon="'mdi-heart'"
              color="grey"
              prepend
              class="ma-0 pa-0"
            ></v-btn>
            <v-btn
              :icon="show[index] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              class="ma-0 pa-0"
              @click="toggleShow(index)"
            ></v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="show[index]">
              <v-divider></v-divider>

              <v-card-text>
                {{ product.description }}
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-hover>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    // Принимает список продуктов от родителя
    products: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      show: [],
    };
  },
  mounted() {
    this.show = new Array(this.products.length).fill(false);
  },
  methods: {
    toggleShow(index) {
      this.show[index]=!this.show[index]
    },
  },
};
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
  font-family: 'Sarpanch', sans-serif;
}

</style>
