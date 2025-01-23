<template>
    <div class="modal-overlay" @click.self="closeModal" v-if="isVisible">
      <div class="modal-content">
        <div class="form-container">
          <h2 class="form-heading">Add Data to Grid</h2>
          <form @submit.prevent="handleSubmit">
            <div v-for="col in colDefs" :key="col.field" class="form-group">
              <label :for="col.field">{{ col.field }}</label>
              <input
                :type="getInputType(col)"
                :id="col.field"
                v-model="formValues[col.field]"
                :placeholder="col.field"
              />
            </div>
            <div class="button-group">
              <ifx-button
                type="submit"
                variant="secondary"
                size="m"
                target="_blank"
                theme="default"
                full-width="false"
              >
                Add Row
              </ifx-button>
              <ifx-button
                type="button"
                variant="secondary"
                size="m"
                target="_blank"
                theme="default"
                full-width="false"
                @click="closeModal"
              >
                Close
              </ifx-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
export default {
  name: 'DynamicForm',
  props: {
    colDefs: {
      type: Array,
      required: true,
    },
    isVisible: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return {
      formValues: {},
    };
  },
  watch: {
    isVisible(newVal) {
      if (newVal) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    },
    colDefs: {
      immediate: true,
      handler(newVal) {
        this.formValues = newVal.reduce((acc, col) => {
          acc[col.field] = '';
          return acc;
        }, {});
      },
    },
  },
  methods: {
    getInputType(col) {
      return col.type === 'number' ? 'number' : 'text';
    },
    handleSubmit() {
      this.$emit('add-row', { ...this.formValues });
      this.closeModal();
    },
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

  
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap');

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 50%;
  max-width: 500px;
  position: relative;
  font-family: 'Source Sans 3', sans-serif; 
}

.form-heading {
  font-family: 'Source Sans 3', sans-serif; 
}

.form-container {
  max-height: 70vh;
  overflow-y: auto;
  font-family: 'Source Sans 3', sans-serif; 
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-family: 'Source Sans 3', sans-serif; 
}

.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  font-family: 'Source Sans 3', sans-serif; 
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

button {
  font-family: 'Source Sans 3', sans-serif; 
}

body.modal-open {
  overflow: hidden;
}
</style>
