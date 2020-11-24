import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment} from '../shared/comment';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  @ViewChild('test') feedbackForm2Directive;
  feedbackForm2: FormGroup;
  comment: Comment;
  dishcopy: Dish;
  

  formErrors = {
    'Author': '',
    'comment': '',
    
  };
   validationMessages = {
    'Author': {
      'required':      'author Name is required.',
      'minlength':     'the author name must be at least 2 characters long.',
    },
    'comment': {
      'required':      'comment is required.',
    },

  };
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }


  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {

    this.createForm();
    let id = this.route.snapshot.params['id'];
    this.dishservice.getDishIds()
     .subscribe(dishIds => this.dishIds = dishIds);
       
    this.route.params
      .pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
        errmess => this.errMess = <any>errmess );


  }

 

  createForm() {
     this.feedbackForm2 = this.fb.group({
      Author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      
      comment: ['', [Validators.required] ],
      rating: 5
    });

    this.feedbackForm2.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.feedbackForm2) { return; }
    const form = this.feedbackForm2;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  onSubmit() {
  var dateobj = new Date();
  var B = dateobj.toISOString();
  this.comment = this.feedbackForm2.value;
  this.comment.date=B;


  this.dishcopy.comments.push(this.comment);
  this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },)
  console.log(this.comment);
  this.feedbackForm2.reset({
    author: '',
    rating : 5,
    comment: '',
  });
  this.feedbackForm2Directive.resetForm();

}
setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack(): void {
    this.location.back();
  }


}

