#pragma once

#include <memory>
#include <optional>
#include <unordered_set>

#include "common_etc.h"

class Sheet;

class Cell : public ICell {
  using Refs = std::unordered_set<Cell*>;

 public:
  Cell(Sheet& sheet);

  Value GetValue() const override;
  std::string GetText() const override;

  std::vector<Position> GetReferencedCells() const override;
  bool IsFree() const;
  void SetText(std::string text);
  void PrepareToDelete();

  void HandleInsertedRows(int before, int count = 1);
  void HandleInsertedCols(int before, int count = 1);

  void HandleDeletedRows(int first, int count = 1);
  void HandleDeletedCols(int first, int count = 1);

 private:
  Sheet& sheet_;
  Refs refs_to_;
  Refs refs_from_;

  std::string text_;
  std::unique_ptr<IFormula> formula_;

  mutable std::optional<Value> value_;

  Refs ProjectRefs(std::vector<Position> positions);
  void ProcessRefs(IFormula* new_formula);
  void CheckCircular(const Refs& refs) const;
  void InvalidateCache();
};