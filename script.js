import { LightningElement, track} from 'lwc';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import getUserContact from '@salesforce/apex/userContact.getUserContact';


export default class CreateLeadForm extends LightningElement {
   

    @track leadDetails = {
        Sender_Name:'',
        LastName : '',
        Company : '',
        Assisted_By: '',
        Line_of_Business: '',
        Received_By: ''
    };
 connectedCallback() {
        this.fetchUserContact();
    }

    fetchUserContact() {
        getUserContact()
            .then(result => {
                this.leadDetails.Sender_Name = result;
             

            })
            .catch(error => {
                this.hasError = true;
                this.errorMessage = error.body.message;
            });
    }

    senderNameHandler(event){
        this.leadDetails.Sender_Name = event.target.value;
    }
    lastNameHandler(event) {
        this.leadDetails.LastName = event.target.value;
    }
    companyHandler(event){
        this.leadDetails.Company = event.target.value;
    }

    assistedByHandler(event){
        this.leadDetails.Assisted_By= event.target.value;
    }
        
    lineOfBusinessHandler(event) {
        this.leadDetails.Line_of_Business = event.target.value;

    }
    receivedByHandler(event){
        this.leadDetails.Received_By = event.target.value;
    }


    handleSubmit(event){
        event.preventDefault();
        const fields={
            Sender_Name__c:this.leadDetails.Sender_Name,
            LastName :this.leadDetails.LastName,
            Company :this.leadDetails.Company,
            Assisted_By__c:this.leadDetails.Assisted_By,
            Line_of_Business__c:this.leadDetails.Line_of_Business,
            Received_By__c:this.leadDetails.Received_By,
        }

        createRecord({ apiName: LEAD_OBJECT.objectApiName, fields })
        
         .then(result => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Successfully Created Record',
                    message: 'Lead Record Created',
                    variant: 'Success'
                })
            );
              
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if(inputFields){
            inputFields.forEach(field => {
                field.reset();
            });
        }
    }
    handleCancel(){
        const inputFields = this.template.querySelectorAll('lightning-input-field');
        if(inputFields){
            inputFields.forEach(field => {
                field.reset();
            });
        }
    };
}
