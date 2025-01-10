<template>
    <div class="d-flex flex-column align-center px-4 py-8 mx-auto">
        <div class="mx-4 text-h6">Step {{ buffer }}</div>
        <v-progress-linear
            :location="null"
            bg-color="#92aed9"
            :buffer-color="buffer_color"
            buffer-opacity="0.3"
            :buffer-value="buffer"
            :color="color"
            height="3"
            max="3"
            min="1"
            :model-value="progress"
            rounded
        ></v-progress-linear>   
    </div>
    
</template>

<script>
export default {
    data : ()=>({
        color : "",
        buffer_color : ""
    }),
    props : {
        buffer: {
            type: Number,
            required: true,
        },
        progress: {
            type: Number,
            required: true,
        },
    },
    mounted(){
        if (this.progress == 0) {
            this.color='red'
            this.buffer_color='red-darken-1'
        }
        if (this.progress == 1) {
            this.color='orange'
            this.buffer_color='orange-darken-4'
        }
        if (this.progress == 2) {
            this.color='green'
            this.buffer_color='green-darken-4'
        }
    }
}

</script>