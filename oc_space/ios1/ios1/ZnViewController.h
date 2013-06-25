//
//  ZnViewController.h
//  ios1
//
//  Created by snandy on 13-6-8.
//  Copyright (c) 2013年 zhoutao. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ZnViewController : UIViewController

// 1 相当于void 2 显示到xib文件
- (IBAction)login;

@property(nonatomic,assign) IBOutlet UITextField *qq;
@property(nonatomic,assign) IBOutlet UITextField *pwd;

@end
