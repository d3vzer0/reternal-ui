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
          <label class="terminaluser terminalprepend">{{claims.username}}</label>
          <label class="terminalprot terminalprepend">{{terminal_proto}}</label>
          <label class="terminalhost terminalprepend">{{terminal_host}}</label>
          <label class="terminalpath terminalprepend">{{terminal_path}}</label>
          <input type="textarea" class="terminalcmd" v-model="terminal_input" @input="search_options" @keydown.tab.prevent="autocomplete"  @keydown.enter.prevent="submit_command" placeholder="cmd"/>
      </b-col>
    </b-row>
     <b-row class="top-10 autosuggestrow">
      <b-col cols="12">
        <div class="autosuggestoutput">
          <label v-for="suggest in suggestions" class="commandsuggestion">{{suggest}} </label>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "TerminalOverview",
  data() {
    return {
      terminal_input: "",
      terminal_proto: "@",
      terminal_host: "reternal",
      terminal_path: "~/# ",
      selected_agent: "",
      suggestions: [],
      local_commands: {
        help: this.show_help,
        details: this.show_details
      },
      commands: ["help", "details"]
    };
  },
  created() {
    EventBus.$on("alertterminal", output => {
      this.output_terminal(output);
    }),
    EventBus.$on("selectagent", agent => {
      this.selected_agent = agent;
      var message = `Changed active agent to: ${agent.hostname}`;
      this.output_terminal(message);
    });
  },
  beforeDestroy(){
    EventBus.$off('selectagent')
  },
  mounted() {
    var console_element = document.querySelector("#terminalui");
    console_element.scrollTop = console_element.scrollHeight;
    this.get_commands();
  },  
  updated() {
    var console_element = document.querySelector("#terminalui");
    console_element.scrollTop = console_element.scrollHeight;
  },
  computed: {
    claims: function() {
      return this.$store.getters['auth/claims']
    },
    last_word: function() {
      var search_list = this.terminal_input.split(" ");
      var last_word = search_list.pop();
      return last_word;
    },
    terminal_prompt: function() {
      var prompt = `${this.terminal_user}${this.terminal_proto}${
        this.terminal_host
      }${this.terminal_path} ${this.terminal_input}`;
      return prompt;
    },
    terminal_output: function() {
      return this.$store.getters['terminal/output']
    }
  },
  methods: {
    get_commands() {
      this.$http
        .get("commands")
        .then(response => this.parse_get_commands(response))
        .catch(response => this.generic_failed(response));
    },
    parse_get_commands(response) {
      var commands = response.data;
      commands.forEach(command => {
        this.commands.push(command.name);
      });
    },
    process_command(all_commands) {
      if (!all_commands.length == 0) {
        if (this.selected_agent.beacon_id) {
          this.$http
            .post("tasks", {
              name: 'terminal',
              beacon_id: this.selected_agent.beacon_id,
              commands: all_commands
            })
            .then(response => this.submit_command_response(response))
            .catch(error => this.submit_command_failed(error.response));
        } else {
          this.output_terminal("No agent currently selected");
        }
      }
    },
    submit_command(value) {
      var terminal_input = this.terminal_input.split("|| ");
      var all_commands = [];
      terminal_input.forEach(command => {
        var split_command = command.split(" ");
        var command_name = split_command[0];
        var command_input = split_command.slice(1).join(" ");
        if (command_name in this.local_commands) {
          this.local_commands[command_name]();
        } else if (this.commands.includes(command_name)) {
          all_commands.push({
            name: command_name,
            input: command_input,
            type: "Manual",
            sleep: 0
          });
        }
      });

      this.process_command(all_commands);
    },
    search_options() {
      this.suggestions = [];
      this.commands.forEach(element => {
        if (element.includes(this.last_word)) {
          this.suggestions.push(element);
        }
      });
    },
    output_terminal(output) {
      this.$store.commit('terminal/add_output', this.terminal_prompt);
      this.$store.commit('terminal/add_output', output);
      this.$store.commit('terminal/add_output', "-");
    },
    autocomplete() {
      if (this.suggestions.length > 0) {
        var search_list = this.terminal_input.split(" ");
        var last_word = search_list.pop();
        search_list.push(this.suggestions[0]);
        this.terminal_input = search_list.join(" ");
      }
    },
    show_help() {
      var output =
        "Directly execute commands via the terminal. Change the active agent via the navigation bar. Type 'details' to display the selected agent details";
      this.output_terminal(output);
    },
    show_details() {
      var agent_details = `Hostname: ${
        this.selected_agent.hostname
      }, Username: ${this.selected_agent.username}, RemoteIP: ${
        this.selected_agent.remote_ip
      }, WorkingDir: ${this.selected_agent.working_dir}`;
      this.output_terminal(agent_details);
    },

    submit_command_failed(response) {
      this.output_terminal(response.data);
    },
    submit_command_response(response) {
      this.output_terminal(response.data.data);
    }
  }
};
</script>

<style lang="scss">

.terminal {
  background-color: #212d37;
  height: 100%;
  margin-left: -50px;
  margin-right: -50px;
  font-family: menlo;
  font-size: 12px;
  &:focus {
    outline: none;
  }
}

#terminalui {
  padding-left: 15px;
  padding-right: 15px;
  color: #d1d1d1;
  overflow-y: auto;
  max-height: 900px;
}

.commandsuggestion {
  margin-right: 10px;
}

.terminalcmd {
  height: 1.55rem;
  background-color: #212d37;
  border: 0px;
  color: #d1d1d1;
  font-size: inherit;
  padding: 0px;
  line-height: 1;
  width: 80%;

  &:focus {
    background-color: inherit;
    color: #d1d1d1;
    border: 0px;
    border-color: none;
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}

.terminalform {
  display: flex;
  flex-direction: row
}

.terminalprepend{
  margin: 0px;
  color: #d1d1d1;
}

.terminalpath {
  margin-right: 10px;
}

.terminalprot {
  color: #b26e63;
  font-weight: 600;
}

</style>
