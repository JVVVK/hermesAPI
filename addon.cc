#include <node.h>
#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <time.h>
#include <sstream>
#include <string>

using namespace v8;
using namespace std;

//int numDP = 100;      // Vietoviu skaicius (demand points, max 10000)
//int numPF = 10;       // Esanciu objektu skaicius (preexisting facilities)
//int numCL = 25;        // Kandidatu naujiems objektams skaicius (candidate locations)
//int numX  = 5;         // Nauju objektu skaicius

double **demandPoints; // Geografiniai duomenys


//=============================================================================


double getTime();
void loadDemandPoints(int dp);
double HaversineDistance(double* a, double* b);
double evaluateSolution(int *X, int dp, int pf, int num);
int increaseX(int *X, int index, int maxindex, int num);

void flpenum(const FunctionCallbackInfo<Value>& args) {

   Isolate* isolate = args.GetIsolate();

   int numDP = args[0]->IntegerValue();    // Vietoviu skaicius (demand points, max 10000)
   int numPF = args[1]->IntegerValue();     // Esanciu objektu skaicius (preexisting facilities)
   int numCL = args[2]->IntegerValue();     // Kandidatu naujiems objektams skaicius (candidate locations)
   int numX  = args[3]->IntegerValue();     // Nauju objektu skaicius

   double ts = getTime();          // Algoritmo vykdymo pradzios laikas

	loadDemandPoints(numDP);             // Nuskaitomi duomenys
	
	// Sudarom pradini sprendini: [0, 1, 2, 3, ...]
	int *X = new int[numX];
	int *bestX = new int[numX];
	for (int i=0; i<numX; i++) {
		X[i] = i;
		bestX[i] = i;
	}
	double u = evaluateSolution(X, numDP, numPF, numX);
	double bestU = u;
	int r;
	//----- Pagrindinis ciklas ------------------------------------------------

	while (true) {
		if (increaseX(X, numX-1, numCL, numX)) {
			u = evaluateSolution(X, numDP, numPF, numX);
			if (u > bestU) {
				bestU = u;
				for (int i=0; i<numX; i++) bestX[i] = X[i];
			}
		}
		else break;
	}
	//----- Rezultatu spausdinimas --------------------------------------------
	
	double tf = getTime();     // Skaiciavimu pabaigos laikas

	//cout << "Geriausias sprendinys:" << endl;
	//for (int i=0; i<numX; i++) {
    //  cout << bestX[i] << " (" << demandPoints[bestX[i]][0] << " " << demandPoints[bestX[i]][1] << ")" << endl; 
   	//}
	//cout << "Potencialiu klientu skaicius: " << bestU << endl;
	//cout << "Skaiciavimo trukme: " << tf-ts << " sek." << endl;

	ostringstream os;
	//os << "Geriausias sprendinys:" << endl;
	//for (int i=0; i<numX; i++) {
      //os << bestX[i] << " (" << demandPoints[bestX[i]][0] << " " << demandPoints[bestX[i]][1] << ")" << endl; 
   //}
	//os << "Potencialiu klientu skaicius: " << bestU << endl;
	//os << "Skaiciavimo trukme: " << tf-ts << " sek." << endl;
	os << "{\"sprendinys\": {\"rezultatai\": [" ;
	for (int i=0; i<numX; i++) {
      os << "{\"result_"<< i << "\": {\"lat\": " << demandPoints[bestX[i]][0] << ", \"lon\": " << demandPoints[bestX[i]][1] << "},"; 
   	}
	os << "{\"klientai\": " << bestU << "},";
	os << "{\"skaiciavimo_laikas\": "<< tf-ts << "}";

  string s = os.str();

  	//cout << s << endl;

  	//int avg = tf-ts;

  	Local<String> retval = String::NewFromUtf8(isolate, s.c_str());
    args.GetReturnValue().Set(retval);
}

//=============================================================================

void loadDemandPoints(int dp) {
	FILE *f;
	f = fopen("demandPoints.dat", "r");
	demandPoints = new double*[dp];
	for (int i=0; i<dp; i++) {
		demandPoints[i] = new double[3];
		fscanf(f, "%lf%lf%lf", &demandPoints[i][0], &demandPoints[i][1], &demandPoints[i][2]);
	}
	fclose(f);
}

//=============================================================================

double HaversineDistance(double* a, double* b) {
   double dlon = fabs(a[0] - b[0]);
   double dlat = fabs(a[1] - b[1]);
   double aa = pow((sin((double)dlon/(double)2*0.01745)),2) + cos(a[0]*0.01745) * cos(b[0]*0.01745) * pow((sin((double)dlat/(double)2*0.01745)),2);
   double c = 2 * atan2(sqrt(aa), sqrt(1-aa));
   double d = 6371 * c; 
   return d;
}

//=============================================================================

double getTime() {
   //struct timeval laikas;
   //gettimeofday(&laikas, NULL);
   //double rez = (double)laikas.tv_sec+(double)laikas.tv_usec/1000000;
   time_t seconds;
   seconds = time (NULL);
   return seconds;
}

//=============================================================================

double evaluateSolution(int *X, int dp, int pf, int num) {
	double U = 0;
	int bestPF;
	int bestX;
	double d;
	for (int i=0; i<dp; i++) {
		bestPF = 1e5;
		for (int j=0; j<pf; j++) {
			d = HaversineDistance(demandPoints[i], demandPoints[j]);
			if (d < bestPF) bestPF = d;
		}
		bestX = 1e5;
		for (int j=0; j<num; j++) {
			d = HaversineDistance(demandPoints[i], demandPoints[X[j]]);
			if (d < bestX) bestX = d;
		}
		if (bestX < bestPF) U += demandPoints[i][2];
		else if (bestX == bestPF) U += 0.3*demandPoints[i][2];
	}
	return U;
}

//=============================================================================

int increaseX(int *X, int index, int maxindex, int num) {
	if (X[index]+1 < maxindex-(num-index-1)) {
		X[index]++;
	}
	else {		 
		if ((index == 0) && (X[index]+1 == maxindex-(num-index-1))) {
			return 0;
		}
		else {
			if (increaseX(X, index-1, maxindex, num)) X[index] = X[index-1]+1;
			else return 0;
		}	
	}
	return 1;
}

void Initialize(Local<Object> exports) {
   NODE_SET_METHOD(exports, "flpenum", flpenum);
}

NODE_MODULE(addon, Initialize);