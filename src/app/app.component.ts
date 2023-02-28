import { Component} from '@angular/core';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs; 

class Product{
  name: string;
  price: number;
  qty: number;
  sNo: string;
  strWood: string;
  numBreadth: number;
  numWidth: number;
  numLength: number;
}
class Invoice{
  customerName: string;
  address: string;
  contactNo: number;
  email: string;
  date: string;
  
  products: Product[] = [];
  additionalDetails: string;

  constructor(){
    // Initially one empty product row we will show 
    this.products.push(new Product());
  }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  invoice = new Invoice(); 
  belowSixCft = '';


  calculateTotal(): void{
    // const bre = document.getElementById('productBreadth');
    // console.log(bre.value);

    const input = document.getElementById(
      'productBreadth',
    ) as HTMLInputElement | null;

    if (input != null) {
      console.log(input.value); // 👉️ "Initial Value"
    }

  }

  generatePDF(action = 'open') {
    let docDefinition = {
      content: [
        {
          text: 'PATIDAR TIMBER',
          bold:true,
          fontSize: 20,
          alignment: 'center',
          decoration: 'underline',
          color: 'red'
        },
        {
          text: 'ESTIMATION',
          fontSize: 16,
          alignment: 'center',
          decoration: 'underline',
          color: 'blue'
        },
        {
          columns: [
            [
              {
                text: `Name: ${this.invoice.customerName}`,
                bold:true
              },
              { text: `Address: ${this.invoice.address}` }
            ],
            [
              {
                text: `Date: ${this.invoice.date}`,
                alignment: 'right'
              },
              { 
                text: `Bill No : ${((Math.random() *1000).toFixed(0))}`,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', 'auto', 'auto', 'auto'],
            body: [
              ['No.', 'Wood', 'Size', 'Rate', 'Quantity', 'Amount'],
              ...this.invoice.products.map(p => ([p.sNo, p.name,(p.numBreadth+' x '+p.numWidth+' x '+p.numLength), p.price, p.qty, (p.price*p.qty).toFixed(2)])),
              [{text: 'Total Amount', colSpan: 4}, {}, {}, {}, {}, this.invoice.products.reduce((sum, p)=> sum + (p.qty * p.price), 0).toFixed(2)]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
            text: this.invoice.additionalDetails,
            margin: [0, 0 ,0, 15]          
        },
        {
          columns: [
            [{ qr: `${this.invoice.customerName}`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
            ul: [
              'Order can be return in max 10 days.',
              'Warrenty of the product will be subject to the manufacturer terms and conditions.',
              'This is system generated invoice.',
            ],
        }
      ],
      styles: {
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]          
        }
      }
    };

    if(action==='download'){
      pdfMake.createPdf(docDefinition).download();
    }else if(action === 'print'){
      pdfMake.createPdf(docDefinition).print();      
    }else{
      pdfMake.createPdf(docDefinition).open();      
    }

  }

  addProduct(){
    this.invoice.products.push(new Product());
  }


}
