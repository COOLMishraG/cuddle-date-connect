#include <iostream>
using namespace std;

int main() {
    cout << "========== COUNT OF ODD AND EVEN DIVISORS FOR NUMBERS 1 TO 100 ==========" << endl << endl;
    
    for (int num = 1; num <= 500; num++) {
        int oddCount = 0;
        int evenCount = 0;
        
        // Count odd and even divisors
        for (int i = 1; i <= num; i++) {
            if (num % i == 0) {
                if (i % 2 == 0) {
                    evenCount++;
                } else {
                    oddCount++;
                }
            }
        }
        
        // Print the number and divisor counts
        cout <<  oddCount << " " 
             << evenCount << endl;
    }
    
    return 0;
}