<?php
namespace module;

class Model
{
    protected $db;

    public function __construct()
    {
        $this->db = db();
    }

    public function index()
    {
        return $this->db->fetch_all('SELECT * FROM '. $this->table .';');
    }

    public function get($id)
    {
        return $this->db->fetch_one('SELECT * FROM '. $this->table .' WHERE id = ?', [$id]);
    }

    public function store($data)
    {
        return $this->db->insertFields($this->table, $data);
    }

    public function save()
    {
        $attributesToSave = $this->removeUndesirableAttributes();
        return $this->store($attributesToSave);
    }

    public function update($id, $fields)
    {
        return $this->db->updateFields($this->table, $fields, 'id = '. $id);
    }

    public function delete($id)
    {
        return $this->db->query('DELETE FROM '. $this->table.' WHERE id = ?', [$id]);
    }

    private function removeUndesirableAttributes()
    {
        $attributes = get_object_vars($this);

        foreach ($attributes as  $attributeName => $attributeValue) {
            if(in_array($attributeName, $this->undesirableAttributes)) {
                unset($attributes[$attributeName]);
            }
        }
        
        return $attributes;
    }
}