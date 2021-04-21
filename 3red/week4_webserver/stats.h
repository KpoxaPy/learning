#pragma once

#include "http_request.h"

#include <string_view>
#include <map>
using namespace std;

class Stats {
public:
  Stats();

  void AddMethod(string_view method);
  void AddUri(string_view uri);

  const map<string_view, int>& GetMethodStats() const;
  const map<string_view, int>& GetUriStats() const;

private:
  map<string_view, int> method_stats_;
  map<string_view, int> uri_stats_;

  static string_view GetMethodView(string_view v);
  static string_view GetUriView(string_view v);
};

HttpRequest ParseRequest(string_view line);
