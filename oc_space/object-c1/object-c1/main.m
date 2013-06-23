//
//  main.m
//  object-c1
//
//  Created by snandy on 13-6-8.
//  Copyright (c) 2013年 zhoutao. All rights reserved.
//

#import <Foundation/Foundation.h>
//#import "Person.h"
#import "Factorial.h";

int main(int argc, const char * argv[])
{
    // create Person instance
//    Person *p1 = [[Person alloc] init];
//    [p1 setName:@"John Resig"];
//    NSString *name = [p1 getName];
//    [Person log:name];
//    
//    [p1 release];
    
    NSLog(@"Result: %li", calculateFactorial(5));
    return 0;
}

