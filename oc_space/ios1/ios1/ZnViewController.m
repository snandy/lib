//
//  ZnViewController.m
//  ios1
//
//  Created by snandy on 13-6-8.
//  Copyright (c) 2013年 zhoutao. All rights reserved.
//

#import "ZnViewController.h"

@interface ZnViewController ()

@end

@implementation ZnViewController

- (void)login {
    NSString *qq = self.qq.text;
    NSString *pwd = self.pwd.text;
    
    NSLog(@"qq: %@, pwd: %@", qq, pwd);
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
