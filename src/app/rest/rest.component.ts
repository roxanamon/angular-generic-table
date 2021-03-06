import {Component, Output, EventEmitter, ViewChild} from '@angular/core';
import {Response, Http } from '@angular/http';
import {CustomRowComponent} from '../custom-row/custom-row.component';
import {GenericTableComponent, GtConfig} from '@angular-generic-table/core';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-rest',
  templateUrl: './rest.component.html'
})
export class RestComponent {

  public configObject: GtConfig<any>;

  @Output() data = new EventEmitter();

  @ViewChild(GenericTableComponent)
  private myTable: GenericTableComponent<any, CustomRowComponent>;
  public expandedRow = CustomRowComponent;
  public showColumnControls = false;
  public selectedRows:number = 0;


  constructor(private http: Http) {

    let url = 'https://private-730c61-generictable.apiary-mock.com/data'; // apiary end point


    this.configObject = {
      settings:[{
        objectKey:'id',
        visible:true,
        sort:'desc',
        columnOrder:0,
        enabled:true

      },{
        objectKey:'name',
        visible:true,
        sort:'enable',
        columnOrder:1
      },{
        objectKey:'email',
        visible:true,
        enabled:true,
        sort:'enable',
        sortOrder:0,
        columnOrder:2
      },{
        objectKey:'gender',
        visible:true,
        enabled:true,
        sort:'enable',
        sortOrder:0,
        columnOrder:3,
        search:false
      },{
        objectKey:'favorite_color',
        visible:true,
        enabled:true,
        sort:'disable',
        sortOrder:0,
        columnOrder:4,
        search:false
      }],
      fields:[{
        name:'Id',
        objectKey:'id',
        classNames:'clickable sort-numeric',
        expand:true
      },{
        name:'Name',
        objectKey:'name',
        classNames:'sort-string',
        value:function(row){return row.first_name + ' ' + row.last_name},
        render:function(row){return '<div>'+row.first_name + ' ' + row.last_name +'</div>'}
      },{
        name:'Favorite color',
        objectKey:'favorite_color',
        classNames:'text-xs-right',
        render:function(row){return '<div style="float:right;width:15px;height:15px;border-radius:50%;background: '+row.favorite_color+'"></div>'},
        click:(row)=>{return console.log(row.first_name + '\'s favorite color is: ' + row.favorite_color );}
      },{
        name:'Gender',
        classNames:'sort-string',
        objectKey:'gender'
      },{
        name:'Email',
        classNames:'sort-string',
        objectKey:'email',
        render: function(row){return '<a href="mailto:'+row.email+'">'+row.email+'</a>' }
      }],
      data:[]
    };
    http.get(url)
      .map((res: Response) => res.json())
      .subscribe(res => {
        this.configObject.data = res.data;
      });
  }

  public addData = function(){

    // create mock data
    let random = Math.floor(Math.random() * this.configObject.data.length -1) + 1;
    let firstName = this.configObject.data[random].first_name;
    let lastName = this.configObject.data[Math.floor(Math.random() * this.configObject.data.length -1) + 1].last_name;
    let gender = this.configObject.data[random].gender;
    let favoriteColor = this.configObject.data[Math.floor(Math.random() * this.configObject.data.length - 1) + 1].favorite_color;
    let birthday = this.configObject.data[Math.floor(Math.random() * this.configObject.data.length - 1) + 1].birthday;

    // push data to data array (could be swapped to a method for persisting the data to a database).
    this.configObject.data.push({
      "id":this.configObject.data.length + 1,
      "first_name":firstName,
      "last_name":lastName,
      "email":firstName +'.'+lastName +'@some_email_address.xyz',
      "gender":gender,
      "favorite_color":favoriteColor,
      "birthday":birthday
    });
  };


  /** Apply predefined filter using first_name.
   * */
  public applyFilter = function(){
    this.myTable.gtApplyFilter({
      first_name:['Victor','Joe','Carol']
    })
  };

  /** Listen for events
   * */
  public trigger = function($event){
    console.log($event);
    if($event.value && $event.value.selectedRows) {
      this.selectedRows = $event.value.selectedRows.length
    }
  };

}
