<template>
  <div id="terminalui">
    <b-row class="terminaloutput">
      <b-col cols="12">
        <div class="output" v-for="output in terminal_output">
          {{output}}
        </div>
      </b-col>
    </b-row>
    <b-row class="top-10 terminalinput">
      <b-col cols="12">
          <label class="terminaluser terminalprepend">{{terminal_user}}</label>
          <label class="terminalprot terminalprepend">{{terminal_proto}}</label>
          <label class="terminalhost terminalprepend">{{terminal_host}}</label>
          <label class="terminalpath terminalprepend">{{terminal_path}}</label>
          <input type="textarea" class="terminalcmd" v-model="terminal_input" @input="search_options" @keydown.tab.prevent="autocomplete" placeholder="cmd"></input>
      </b-col>
    </b-row>
     <b-row class="top-10 autosuggestrow">
      <b-col cols="12">
        <div class="autosuggestoutput">
          <label v-for="suggest in suggestions">{{suggest}}</label>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "TerminalOverview",
  data(){
    return {
      terminal_input: "",
      terminal_user: "joeydreijer",
      terminal_proto: "@",
      terminal_host: "reternal",
      terminal_path: "~/# ",
      terminal_output: [],
      selected_agent: "",
      suggestions: [],
      commands: [
        "help"
      ],
    }
  },
  created (){
    EventBus.$on('alertterminal', output => {
      this.output_terminal(output)
    }),
    EventBus.$on('selectagent', agent => {
      this.selected_agent = agent;
      var message = `Changed active agent to: ${agent}`
      this.output_terminal(message)
    })
  },
  mounted (){
      var console_element = document.querySelector('#terminalui');
      console_element.scrollTop = console_element.scrollHeight;
  },
  updated (){
      var console_element = document.querySelector('#terminalui');
      console_element.scrollTop = console_element.scrollHeight;
  },
  computed: {
    last_word: function(){
      var search_list = this.terminal_input.split(" ");
      var last_word = search_list.pop();
      return last_word;
    }
  },
  methods: {
    submit_command (value){
      this.terminal_output.push(this.terminal_input);
    },
    search_options(){
      this.suggestions = [];
      this.commands.forEach(element => {
        if(element.includes(this.last_word)){
          this.suggestions.push(element)
        }
      });
    },
    output_terminal(output){
       this.terminal_output.push(output);
    },
    autocomplete(){
      if(this.suggestions.length > 0){
        var search_list = this.terminal_input.split(" ");
        var last_word = search_list.pop();
        search_list.push(this.suggestions[0])
        this.terminal_input = search_list.join(" ")
      }
    }

  }
};
</script>

<style lang="sass">

.terminal
  background-color: #212d37
  height: 100%
  margin-left: -15px
  margin-right: -15px
  font-family: monospace
  &:focus
    outline: none

#terminalui
  padding-left: 15px
  padding-right: 15px
  color: #d1d1d1
  overflow-y: auto
  max-height: 900px


.terminalcmd
  height: 1.55rem
  background-color: #212d37
  border: 0px
  color: #d1d1d1
  font-size: inherit
  padding: 0px
  line-height: 1
  width: 80%

  &:focus
    background-color: inherit
    color: #d1d1d1
    border: 0px
    border-color: none
    outline: none
    -webkit-box-shadow: none
    box-shadow: none

.terminalform 
  display: flex
  flex-direction: row

.terminalprepend
  font-weight:
  margin: 0px
  color: #d1d1d1

.terminalpath
  margin-right: 10px

.terminalprot
  color: #b26e63
  font-weight: 600

</style>
