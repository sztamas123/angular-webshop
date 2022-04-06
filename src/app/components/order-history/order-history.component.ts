import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orderList: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.manageOrderHistory();
  }

  // Get user's email address and retrieve data from service
  manageOrderHistory() {
    const email = JSON.parse(this.storage.getItem('userEmail'));
    this.orderHistoryService.getCustomerOrders(email).subscribe(
      data => {
        this.orderList = data._embedded.orders;
      }
    );
  }

}
