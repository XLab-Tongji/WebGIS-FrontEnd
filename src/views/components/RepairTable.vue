<template>
  <div class="vodal-container">
    <div>
      <a @click="onSubmitRepairChange" class="icon"><i class="fa fa-check fa-lg" aria-hidden="true"></i></a>
    </div>
    <table class="table table-striped table-bordered table-hover">
      <thead>
      <tr>
        <th><input type="checkbox"></th>
        <th>lat</th>
        <th>lng</th>
        <th>物品状态</th>
        <th>描述</th>
        <th>创建时间</th>
        <th>报修状态</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="ownRepair,index in ownRepairs" :class="ownRepair.originState!==ownRepair.state?'green':''">
        <td>
          <input type="checkbox">
        </td>
        <td>{{!ownRepair.point || ownRepair.point.y}}</td>
        <td>{{!ownRepair.point || ownRepair.point.x}}</td>
        <td>{{!ownRepair.point || ownRepair.point.status}}</td>
        <td>{{ownRepair.desc}}</td>
        <td>{{formatDate(ownRepair.createDate)}}</td>
        <td>
          <select v-model="ownRepair.state" class="form-control">
            <option
              :value="repairState"
              v-for="repairState in repairStates">{{repairState}}</option>
          </select>
        </td>
        <td>
          <a class="icon" @click="onUpdateCenterClick($event,index)"><i class="fa fa-map-marker fa-lg"></i></a>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import utils from '@/service/utils'
  import MapService from '@/service/mapService'
  import LayerService from '@/service/httpService/LayerService'
  import RepairService from '@/service/httpService/RepairService'
  export default {
    data () {
      return {
        repairStates: ['LOST', 'BLOCK', 'DAMAGE', 'FINISH']
      }
    },
    props: {
      ownRepairs: {
        default: []
      }
    },
    methods: {
      async onSubmitRepairChange () {
        let isSuccess = true
        for(let i = 0; i < this.ownRepairs.length; i++) {
          if (this.ownRepairs[i].originState !== this.ownRepairs[i].state) {
            let respBody = await RepairService.updateState(this, this.ownRepairs[i].id, this.ownRepairs[i].state)
            if (respBody.code !== 200) {
              toastr.error('提交修改失败！')
              isSuccess = false
              break
            }
            this.ownRepairs[i].originState = this.ownRepairs[i].state
          }
        }
        if (isSuccess) {
          toastr.success('提交修改成功！')
        }
      },

      onUpdateCenterClick(event, repairIndex){
        this.$emit('onUpdateCenterClick', repairIndex)
      },

      formatDate (date) {
        return utils.formatDate(new Date(date), 'yyyy-MM-dd')
      },
    }
  }
</script>

<style scoped>
  /* vodal-container */
  .vodal-container {
    width: 95%;
    overflow: auto;
  }
  /* #vodal-container */

  table tr.green {
    background-color: greenyellow;
  }

  .icon {
    color: #1ab394;
  }
</style>
