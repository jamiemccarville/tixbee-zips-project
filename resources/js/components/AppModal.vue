<template>
  <transition name="modal ">
    <div class="font-sans modal-mask">
      <div class="modal-wrapper">
        <div class="w-11/12 rounded-lg modal-container sm:w-8/12 lg:w-2/4">
          <div class="modal-header">
            <slot name="header">default header</slot>
          </div>

          <div class="modal-body">
            <slot name="body">default body</slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
          <div class="button-placement">
            <button
              class="uk-button uk-button-default uk-button-small"
              @click="$emit('close')"
            >Got it!</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {};
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 60%;
  border-radius: 5px;
  margin: 0px auto;
  padding: 20px 30px;
  background: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

/* .modal-button {
  border: 2px solid #ff6200;
  font-family: montserrat;
  font-size: inherit;
}

.modal-button:hover {
  cursor: pointer;
  background: #ff6200;
  color: #fafafa;
} */

.button-placement {
  display: flex;
  justify-content: center;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
