<template>
  <q-page>
    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row">
      <!-- Filter column -->
      <div class="col-3">
        <div class="row">
          <div class="col">
            <q-card flat>
              <q-card-section>
                <div class="text-h6">1. Purpose</div>
              </q-card-section>
              <q-card-section>
                <q-editor v-model="purpose" flat/>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <q-card flat>
              <q-card-section>
                <div class="text-h6">2. Stakeholders</div>
              </q-card-section>
              <q-card-section>
                <q-table grid flat
                  :data="stakeholders"
                  :columns="stakeholderColumns"
                  row-key="name"
                  hide-header
                 >
                  <template v-slot:item="props">
                    <div class="q-pa-xs col-xs-12 col-sm-6 col-md-12">
                      <q-card class="stakeholder" flat>
                        <q-card-section>
                          <!-- <div class="row"> -->
                            <div class="text-h6">{{ props.row.full_name }}</div>
                            <div class="text-subtitle2">{{ props.row.org }}</div>
                          </q-card-section>
                          <q-card-section class="q-pt-none">
                            <div class="text">
                              <div class="row">
                                <div class="col">
                                  <q-badge class="pinned"><q-icon name="mdi-account-details" class="q-mr-xs"/> {{ props.row.role }}</q-badge>
                                </div>
                                <div class="col">
                                  <q-badge class="pinned"><q-icon name="mdi-account" class="q-mr-xs"/> {{ props.row.full_name }}</q-badge>
                                </div>
                              </div>
                            </div>
                          </q-card-section>
                          <!-- </div> -->
                        <!-- </q-card-section> -->
                          <!-- <div class="text-subtitle2">by John Doe</div> -->
                        <!-- <q-card-section> -->
                      </q-card>
                    </div>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <!-- /Results column -->
    </div>
    <!-- /Center content row -->
  </q-page>
</template>

<script>

export default {
  name: 'Lifecycle',
  components: {
  },
  data () {
    return {
      purpose: '',
      stakeholders: [
        {
          org: 'Terracorp',
          full_name: 'Joey Dreijer',
          role: 'Engineer'
        },
        {
          org: 'CyberStack',
          full_name: 'Bob Morgan',
          role: 'Business'
        }
      ],
      stakeholderColumns: [
        { name: 'org', label: 'org', field: 'org' },
        { name: 'full_name', label: 'full_name', field: 'full_name' },
        { name: 'role', label: 'role', field: 'role' }
      ]
    }
  },
  created () {
  },
  watch: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.stakeholder {
  border-style: solid;
  border-width: thin thin thin thick;
  border-color: #primary;
  .pinned {
    width: 80%;
   height: 25px;
  }
}
</style>
