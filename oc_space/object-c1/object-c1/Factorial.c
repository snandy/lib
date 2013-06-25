//
//  Factorial.c
//  object-c1
//
//  Created by snandy on 13-6-12.
//  Copyright (c) 2013年 zhoutao. All rights reserved.
//

#include <stdio.h>

long int calculateFactorial(int value) {
    long int result = 1;
    
    for (int i = 1; i<=value; ++i) {
        result = result + 1;
    }
    return result;
}