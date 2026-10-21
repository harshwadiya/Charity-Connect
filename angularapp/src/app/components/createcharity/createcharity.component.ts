import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Charity } from 'src/app/models/charity.model';
import { CharityService } from 'src/app/services/charity.service';
import { PopupService } from 'src/app/shared/popup/popup.service';

@Component({
  selector: 'app-createcharity',
  templateUrl: './createcharity.component.html',
  styleUrls: ['./createcharity.component.css']
})
export class CreatecharityComponent implements OnInit{
    newCharity:Charity={
      charityName: '',
      description: '',
      founder: '',
      creationDate: undefined,
      status: ''
    }

    formSubmitted:boolean=false;

    isEditMode:boolean=false;
    charityId:number=0; 

    constructor(private charityService:CharityService,private router:Router,private route :ActivatedRoute,private popup: PopupService){ }

    ngOnInit():void{
      this.route.params.subscribe( params =>{
        if(params['id']){
          this.isEditMode=true;
          this.charityId= +params['id'];
          this.loadCharity(this.charityId);
        }
      });
    }

    loadCharity(id:number):void{
      this.charityService.getCharityById(id).subscribe({
        next:(data)=>{
          this.newCharity=data;
        },
        error:(error)=>{
          console.error(error)
          this.popup.error('Failed to load charity details');
        }
      });
    }

    createCharity():void{

      this.formSubmitted=true;
      

      if(
        !this.newCharity.charityName || !this.newCharity.description || !this.newCharity.founder || !this.newCharity.status
     ){
      return;
     }

     if(this.isEditMode){
      this.updateCharity();
     }
     else{
      this.newCharity.creationDate=new Date();
      this.addCharity();
     }

    }

      addCharity():void{
        this.charityService.addCharity(this.newCharity).subscribe({
          next : ()=>{
    
            this.popup.success('Charity added successfully');
            setTimeout(() => this.router.navigate(['/admin/charities']), 2000);
            
          },
          error:error =>{
            if(
              error.status === 409 || error.error?.message?.includes('already exists')
            ){
              this.popup.error('Charity with the same name already exists');
            } else{
              console.error(error);
              this.popup.error('Failed to add charity');
            }
          }
        });
      }

      updateCharity():void{
        this.charityService.updateCharity(this.charityId,this.newCharity).subscribe({
           next:()=>{
            this.popup.success('Charity updated successfully');
            setTimeout(() => this.router.navigate(['/admin/charities']), 2000);
           },
           error:(error)=>{
            console.error(error);
            this.popup.error('Failed to update charity');
           }
           
        });
      }
      
    
}
