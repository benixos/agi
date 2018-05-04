#include <stdio.h>
#include <stdio.h>
#include <stdlib.h>
#include <os_host.h>
#include <stdlib.h>
#include <assert.h>

extern int setupHTTP(void);
extern int startHTTP(void);
extern int acceptHTTP(void);
    
int main(int argc, char** argv) 
{
    int c;
    int running = 0;
	while ((c = getopt(argc, argv,"hkvV")) != EOF) {
		switch(c) {
			case 'k':
				printf("killing system\n");
				break;
			case 'h':
				printf( "usage: agid [-hk] \n"
			   			"-h : show help\n"
			   			"-k : shutdown system \n");
				return 0;
				break;
			case 'v':
			case 'V':
				//printf("%s version %i.%i\n",PRODUCT_NAME,PRODUCT_VERSION,PRODUCT_SUB_VERSION);
				return 0;
				break;
		}
	};
    
	//os_init(argc, argv);

    setupHTTP();
    startHTTP();
        
    running = 1;
    
    while(running) {
        acceptHTTP();
    }
    
}
